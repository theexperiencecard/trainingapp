import { useEffect, useRef, useState } from 'react';
import { localDate, newOperationId, type SetMeasurements } from '../core/journalInput';
import type { PlanProfile } from '../core/planSelection';
import { sampleExerciseIds } from '../core/sampleExercises';
import { addedSetId, addSet, type Exercise, type JournalSet } from '../storage/localJournal';
import { sampleDuration, samplePlanOptions } from './samplePlanOptions';
import { dailyVolumes } from '../core/journalVolume';
import { GuidedSetForm } from './GuidedSetForm';
import { journalText } from '../locales/journal';
import { lastRecordedSet } from '../core/lastRecordedSet';
import type { LocalJournalState } from './journalUpdates';
import type { Locale } from '../locales/messages';
import it from '../locales/demo-it.json';
import de from '../locales/demo-de.json';
import en from '../locales/demo-en.json';

const translations = { it, de, en } satisfies Record<Locale, typeof it>;
type Choice = 'keepBench' | 'today' | 'alsoThursday';

const choices: readonly Choice[] = ['keepBench', 'today', 'alsoThursday'];

type DemoRun = { day: string; first: Exercise; canSwitch: boolean };

type LoggedSet = Pick<JournalSet, 'id' | 'exercise' | 'day' | 'status' | 'kg' | 'reps' | 'rir'>;

export function SessionDemo({ locale, profile, journal }: { locale: Locale; profile: PlanProfile | undefined; journal: LocalJournalState }) {
  const text = translations[locale];
  const [run, setRun] = useState<DemoRun | null>(null);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  const pending = useRef<string | null>(null);
  const writing = useRef(false);
  const [logged, setLogged] = useState<LoggedSet[]>([]);
  const journalRows = logged.map(saved => journal.sets?.find(row => row.id === saved.id) ?? saved);
  const [choice, setChoice] = useState<Choice>('keepBench');
  const options = samplePlanOptions(profile);
  const [firstAvailable] = options;
  const canSwitch = options.length > 1;
  const duration = sampleDuration(canSwitch);
  const availableMinutes = profile ? profile.maxSessionSeconds / 60 : undefined;
  const fitsBudget = !profile || duration <= profile.maxSessionSeconds;
  const timeSummary = (canSwitch ? text.durationWithChange : text.duration)
    .replace('{minutes}', (duration / 60).toLocaleString(locale));
  const timeConflict = text.timeConflict.replace('{available}', availableMinutes?.toLocaleString(locale) ?? '');
  const first = run?.first ?? firstAvailable ?? 'bench';
  const current: Exercise = choice === 'keepBench' ? first : 'machine';
  const thursday: Exercise = choice === 'alsoThursday' ? 'machine' : first;
  const noExample = profile?.goal === 'strength' || profile?.goal === 'muscle'
    ? text.noCompatibleExercise : text.otherGoal;
  const plan = canSwitch ? text.plan : firstAvailable === 'machine' ? text.machinePlan : text.benchPlan;
  const complete = logged.length === 2;
  const currentTitle = [text.first, text.second, text.complete][logged.length];
  function setLabel(row: LoggedSet) {
    if (row.status !== 'completed') return journalText[locale][row.status];
    const load = row.exercise === 'bench' ? text.benchLoad : text.machineLoad;
    const kg = row.kg === null ? journalText[locale].unknownLoad : row.kg.toLocaleString(locale) + ' ' + load;
    const rir = row.rir === null ? journalText[locale].rirUnknown : journalText[locale].rirUnit + ' ' + row.rir;
    return `${kg} × ${row.reps.toLocaleString(locale)} · ${rir}`;
  }

  const step = run ? logged.length : -1;
  const currentHeading = useRef<HTMLHeadingElement>(null);
  const nextExercise = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (step >= 0) currentHeading.current?.focus();
  }, [step]);

  async function record(values: SetMeasurements) {
    if (!run || complete || writing.current) return;
    writing.current = true;
    setSaving(true);
    setFailed(false);
    try {
      pending.current ??= newOperationId();
      await addSet(pending.current, run.day, current, values);
      const id = addedSetId(pending.current);
      await journal.announceWrite();
      setLogged([...logged, { id, ...values, exercise: current, day: run.day, status: 'completed' }]);
    } catch {
      setFailed(true);
      return;
    } finally {
      writing.current = false;
      setSaving(false);
    }
    pending.current = null;
  }

  function restart() {
    if (!firstAvailable || !fitsBudget) return;
    setLogged([]);
    setChoice('keepBench');
    setRun({ day: localDate(new Date()), first: firstAvailable, canSwitch });
  }

  return (
    <section className="session-demo" aria-labelledby="demo-heading">
      <h2 id="demo-heading">{text.heading}</h2>
      <p>{text.intro}</p>

      {!run ? (
        firstAvailable ? (
          <>
            <p>{plan}</p>
            <p>{timeSummary}</p>
            {fitsBudget ? (
              <>
                {profile && <p>{text.verifySetup}</p>}
                <button type="button" onClick={restart}>{text.start}</button>
              </>
            ) : <p role="status">{timeConflict}</p>}
          </>
        ) : <p>{noExample}</p>
      ) : (
        <>
          <div className="demo-current">
            <h3 ref={currentHeading} tabIndex={-1}>{currentTitle}</h3>
            {logged.length === 1 && (
              <>
                <p><a href="#workout-timer-heading">{text.openTimer}</a></p>
                {run.canSwitch && (
                  <label className="demo-choice">
                    {text.choice}
                    <select value={choice} disabled={saving || failed} onChange={(event) => {
                      const selected = choices.find((option) => option === event.target.value);
                      if (selected) setChoice(selected);
                    }}>
                      {choices.map((option) => <option key={option} value={option}>{text[option]}</option>)}
                    </select>
                  </label>
                )}
                <div aria-live="polite">
                  {run.canSwitch && current === 'machine' && (
                    <>
                      <p>{text.machineMovement}</p>
                      <p>{text.machineTradeoff}</p>
                    </>
                  )}
                </div>
              </>
            )}
            {!complete && (
              <>
                <GuidedSetForm key={logged.length} locale={locale} exercise={current}
                  reference={journal.sets && !journal.readFailure ? lastRecordedSet(journal.sets, current, run.day) : null}
                  referenceStatus={journal.readFailure ?? (journal.sets === null ? 'loading' : 'ready')}
                  saving={saving} failed={failed} onRecord={record}
                  submitLabel={failed ? text.retry : logged.length === 0 ? text.recordFirst : text.recordSecond} />
                {failed && <p role="alert">{text.saveError}</p>}
              </>
            )}
          </div>

          {logged.length > 0 && (
            <div className="demo-history">
              <h3>{text.history}</h3>
              <ol>
                {journalRows.map((row) => (
                  <li key={row.id}>{text[row.exercise]} · {setLabel(row)}</li>
                ))}
              </ol>
              <h3>{text.volume}</h3>
              <dl>
                {sampleExerciseIds.map(exercise => {
                  const [volume] = dailyVolumes(journalRows, exercise);
                  if (!volume) return null;
                  return (
                    <div key={exercise}>
                      <dt>{exercise === 'bench' ? text.benchVolume : text.machineVolume}</dt>
                      <dd>{volume.kg === null ? text.unknownVolume : volume.kg.toLocaleString(locale) + ' ' + text.unit}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          )}

          <div className="demo-next">
            <h3>{text.next}</h3>
            <p aria-live="polite" ref={nextExercise} tabIndex={-1}>{text[thursday]}</p>
            {complete && choice === 'alsoThursday' && (
              <button className="demo-secondary" type="button" onClick={() => {
                setChoice('today');
                nextExercise.current?.focus();
              }}>
                {text.restore}
              </button>
            )}
          </div>
          {complete && (
            <div className="demo-actions">
              <a href="#local-journal-heading">{text.openJournal}</a>
              {!firstAvailable ? <p>{noExample}</p> : fitsBudget ? (
                <button className="demo-secondary" type="button" onClick={restart}>{text.restart}</button>
              ) : <p role="status">{timeConflict}</p>}
            </div>
          )}
        </>
      )}
    </section>
  );
}
