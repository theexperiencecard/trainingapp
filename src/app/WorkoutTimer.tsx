import { useContext, type ReactNode } from 'react';
import { useWorkoutTimer, WorkoutTimerContext } from './useWorkoutTimer';
import type { Locale } from '../locales/messages';
import it from '../locales/timer-it.json';
import de from '../locales/timer-de.json';
import en from '../locales/timer-en.json';

const translations = { it, de, en } satisfies Record<Locale, typeof it>;

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

export function WorkoutTimerProvider({ children }: { children: ReactNode }) {
  const controller = useWorkoutTimer();
  return <WorkoutTimerContext value={controller}>{children}</WorkoutTimerContext>;
}

export function WorkoutTimer({ locale, inline = false }: { locale: Locale; inline?: boolean }) {
  const text = translations[locale];
  const controller = useContext(WorkoutTimerContext);
  if (!controller) throw new Error('WorkoutTimer requires WorkoutTimerProvider.');
  const {
    timer, readFailed, duration, setDuration, error, setError,
    lastHold, seconds, running, save, startCountdown, startStopwatch,
  } = controller;

  const controls = (
    <>
      {readFailed && (
        <>
          <p role="alert">{text.readError}</p>
          <button type="button" onClick={() => save(null, Date.now())}>{text.reset}</button>
        </>
      )}
      {!readFailed && !timer && (
        <>
          <label>
            {text.duration}
            <input type="number" min="1" step="1" inputMode="numeric" value={duration}
              aria-invalid={error === 'durationError'}
              onChange={(event) => { setDuration(event.target.value); setError(null); }} />
          </label>
          <div className="demo-actions">
            <button type="button" onClick={startCountdown}>{text.startCountdown}</button>
            <button type="button" className="demo-secondary" onClick={startStopwatch}>{text.startStopwatch}</button>
          </div>
        </>
      )}
      {timer && (
        <>
          <p>{timer.kind === 'countdown' ? text.remaining : text.elapsed} <strong role="timer">{formatTime(seconds)}</strong></p>
          {timer.kind === 'countdown' && seconds === 0 && <p role="status">{text.finished}</p>}
          <button type="button" onClick={() => save(null, Date.now())}>{running ? text.stop : text.dismiss}</button>
        </>
      )}
      {lastHold !== null && <p role="status">{text.lastHold} {formatTime(lastHold)}</p>}
      {error && <p role="alert">{text[error]}</p>}
    </>
  );

  if (inline) return (
    <details className="workout-timer-inline">
      <summary>{text.heading}</summary>
      {controls}
    </details>
  );

  return (
    <section className="session-demo" aria-labelledby="workout-timer-heading">
      <h2 id="workout-timer-heading" tabIndex={-1}>{text.heading}</h2>
      <p>{text.local}</p>
      {controls}
    </section>
  );
}
