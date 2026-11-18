import { useEffect, useState } from 'react';
import {
  createCountdown, createStopwatch, parseStoredTimer, secondsForTimer, TIMER_STORAGE_KEY, type TimerState,
} from '../core/workoutTimer';
import type { Locale } from '../locales/messages';
import it from '../locales/timer-it.json';
import de from '../locales/timer-de.json';
import en from '../locales/timer-en.json';

const translations = { it, de, en } satisfies Record<Locale, typeof it>;

function loadTimer() {
  try {
    const timer = typeof window === 'undefined' ? null : parseStoredTimer(window.localStorage.getItem(TIMER_STORAGE_KEY));
    return { timer, readFailed: false };
  } catch {
    return { timer: null, readFailed: true };
  }
}

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

export function WorkoutTimer({ locale }: { locale: Locale }) {
  const text = translations[locale];
  const [{ timer, readFailed }, setStored] = useState(loadTimer);
  const [now, setNow] = useState(Date.now);
  const [duration, setDuration] = useState('');
  const [error, setError] = useState<'durationError' | 'writeError' | null>(null);
  const [lastHold, setLastHold] = useState<number | null>(null);
  const seconds = timer ? secondsForTimer(timer, now) : 0;
  const running = timer?.kind === 'stopwatch' || seconds > 0;

  useEffect(() => {
    const refresh = () => {
      setStored(loadTimer());
      setLastHold(null);
      setError(null);
      setNow(Date.now());
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === TIMER_STORAGE_KEY) refresh();
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        setNow(Date.now());
      }
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('pageshow', refresh);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('pageshow', refresh);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [running]);

  function save(next: TimerState | null, timestamp: number) {
    try {
      if (next) window.localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(next));
      else window.localStorage.removeItem(TIMER_STORAGE_KEY);
    } catch {
      setError('writeError');
      return;
    }
    setLastHold(next === null && timer?.kind === 'stopwatch' ? secondsForTimer(timer, timestamp) : null);
    setStored({ timer: next, readFailed: false });
    setError(null);
    setNow(timestamp);
  }

  function startCountdown() {
    const timestamp = Date.now();
    try {
      save(createCountdown(timestamp, Number(duration)), timestamp);
    } catch {
      setError('durationError');
    }
  }

  function startStopwatch() {
    const timestamp = Date.now();
    save(createStopwatch(timestamp), timestamp);
  }

  return (
    <section className="session-demo" aria-labelledby="workout-timer-heading">
      <h2 id="workout-timer-heading">{text.heading}</h2>
      <p>{text.local}</p>
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
    </section>
  );
}
