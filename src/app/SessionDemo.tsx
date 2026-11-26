import { useEffect, useRef, useState } from 'react';
import { localDate, type SetMeasurements } from '../core/journalInput';
import type { PlanProfile } from '../core/planSelection';
import { pressExerciseIds, type PressExercise } from '../core/sampleExercises';
import type { JournalSet } from '../storage/localJournal';
import { sampleDuration, samplePlanOptions } from './samplePlanOptions';
import { dailyExerciseTotals } from '../core/journalVolume';
import { GuidedSetForm } from './GuidedSetForm';
import { journalText } from '../locales/journal';
import { lastRecordedSet } from '../core/lastRecordedSet';
import type { LocalJournalState } from './journalUpdates';
import type { Locale } from '../locales/messages';
import { demoText } from '../locales/sessions';
import { useGuidedSetRecorder } from './useGuidedSetRecorder';

type Choice = 'keepBench' | 'today' | 'alsoThursday';

const choices: readonly Choice[] = ['keepBench', 'today', 'alsoThursday'];

type DemoRun = { day: string; first: PressExercise; canSwitch: boolean };

type LoggedSet = Pick<JournalSet, 'id' | 'day' | 'status' | 'kg' | 'reps' | 'rir'> & { exercise: PressExercise };

export function SessionDemo({ locale, profile, journal }: { locale: Locale; profile: PlanProfile | undefined; journal: LocalJournalState }) {
  const text = demoText[locale];
  const [run, setRun] = useState<DemoRun | null>(null);
  const { save, saving, failed } = useGuidedSetRecorder(journal);
  const [logged, setLogged] = useState<LoggedSet[]>([]);
  const journalRows = logged.map(saved => ({ ...saved, ...journal.sets?.find(row => row.id === saved.id), exercise: saved.exercise }));
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
  const current: PressExercise = choice === 'keepBench' ? first : 'machine';
  const thursday: PressExercise = choice === 'alsoThursday' ? 'machine' : first;
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
    if (!run || complete) return;
    await save(run.day, current, values, id => {
      setLogged([...logged, { id, ...values, exercise: current, day: run.day, status: 'completed' }]);
    });
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
                {pressExerciseIds.map(exercise => {
                  const [volume] = dailyExerciseTotals(journalRows, exercise);
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
