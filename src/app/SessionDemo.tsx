import { useEffect, useRef, useState } from 'react';
import { localDate, newOperationId } from '../core/journalInput';
import { estimateSessionSeconds } from '../core/sessionTiming';
import { sampleExerciseIds, sampleExercises } from '../core/sampleExercises';
import { addSet, type Exercise } from '../storage/localJournal';
import { demoExerciseOptions, type PressComparison } from './pressComparison';
import { notifyJournal } from './journalUpdates';
import type { Locale } from '../locales/messages';
import it from '../locales/demo-it.json';
import de from '../locales/demo-de.json';
import en from '../locales/demo-en.json';

const translations = { it, de, en } satisfies Record<Locale, typeof it>;
type Choice = 'keepBench' | 'today' | 'alsoThursday';

const choices: readonly Choice[] = ['keepBench', 'today', 'alsoThursday'];

type DemoRun = { day: string; first: Exercise; canSwitch: boolean };

type SessionDemoProps = {
  locale: Locale;
  comparison: PressComparison | undefined;
  availableMinutes: number | undefined;
};

// Sample times for the preview only.
function demoDuration(canSwitch: boolean) {
  return estimateSessionSeconds({
    preparationSeconds: 120,
    setSeconds: [45, 45],
    gaps: [{ recoverySeconds: 120, changeSeconds: canSwitch ? 150 : 0, overlap: true }],
  });
}

export function SessionDemo({ locale, comparison, availableMinutes }: SessionDemoProps) {
  const text = translations[locale];
  const [run, setRun] = useState<DemoRun | null>(null);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  const pending = useRef<string | null>(null);
  const writing = useRef(false);
  const [logged, setLogged] = useState<Exercise[]>([]);
  const [choice, setChoice] = useState<Choice>('keepBench');
  const options = demoExerciseOptions(comparison);
  const [firstAvailable] = options;
  const canSwitch = options.length > 1;
  const duration = demoDuration(canSwitch);
  const fitsBudget = availableMinutes === undefined || duration <= availableMinutes * 60;
  const timeSummary = (canSwitch ? text.durationWithChange : text.duration)
    .replace('{minutes}', (duration / 60).toLocaleString(locale));
  const timeConflict = text.timeConflict.replace('{available}', availableMinutes?.toLocaleString(locale) ?? '');
  const first = run?.first ?? firstAvailable ?? 'bench';
  const current: Exercise = choice === 'keepBench' ? first : 'machine';
  const thursday: Exercise = choice === 'alsoThursday' ? 'machine' : first;
  const noExample = comparison === null ? text.otherGoal : text.noCompatibleExercise;
  const plan = canSwitch ? text.plan : firstAvailable === 'machine' ? text.machinePlan : text.benchPlan;
  const complete = logged.length === 2;
  const currentTitle = [text.first, text.second, text.complete][logged.length];
  function setLabel(exercise: Exercise) {
    const { kg, reps } = sampleExercises[exercise].set;
    const load = exercise === 'bench' ? text.benchLoad : text.machineLoad;
    return `${kg.toLocaleString(locale)} ${load} × ${reps.toLocaleString(locale)}`;
  }

  const step = run ? logged.length : -1;
  const currentHeading = useRef<HTMLHeadingElement>(null);
  const nextExercise = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (step >= 0) currentHeading.current?.focus();
  }, [step]);

  async function record() {
    if (!run || complete || writing.current) return;
    writing.current = true;
    setSaving(true);
    setFailed(false);
    try {
      pending.current ??= newOperationId();
      await addSet(pending.current, run.day, current);
    } catch {
      setFailed(true);
      return;
    } finally {
      writing.current = false;
      setSaving(false);
    }
    pending.current = null;
    setLogged([...logged, current]);
    notifyJournal();
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
                {comparison && <p>{text.verifySetup}</p>}
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
                <p>{text[current]} · {setLabel(current)}</p>
                <button type="button" disabled={saving} onClick={() => void record()}>
                  {failed ? text.retry : logged.length === 0 ? text.recordFirst : text.recordSecond}
                </button>
                {failed && <p role="alert">{text.saveError}</p>}
              </>
            )}
          </div>

          {logged.length > 0 && (
            <div className="demo-history">
              <h3>{text.history}</h3>
              <ol>
                {logged.map((exercise, index) => (
                  <li key={index}>{text[exercise]} · {setLabel(exercise)}</li>
                ))}
              </ol>
              <h3>{text.volume}</h3>
              <dl>
                {sampleExerciseIds.filter((exercise) => logged.includes(exercise)).map((exercise) => (
                  <div key={exercise}>
                    <dt>{exercise === 'bench' ? text.benchVolume : text.machineVolume}</dt>
                    <dd>{sampleExercises[exercise].set.kg * sampleExercises[exercise].set.reps * logged.filter((item) => item === exercise).length} {text.unit}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="demo-next">
            <h3>{text.next}</h3>
            <p aria-live="polite" ref={nextExercise} tabIndex={-1}>{text[thursday]}</p>
            {complete && thursday === 'machine' && (
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
