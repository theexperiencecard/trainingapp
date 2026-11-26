import { createContext, useEffect, useState } from 'react';
import {
  createCountdown, createStopwatch, parseStoredTimer, secondsForTimer, TIMER_STORAGE_KEY, type TimerState,
} from '../core/workoutTimer';

function loadTimer() {
  try {
    const timer = typeof window === 'undefined' ? null : parseStoredTimer(window.localStorage.getItem(TIMER_STORAGE_KEY));
    return { timer, readFailed: false };
  } catch {
    return { timer: null, readFailed: true };
  }
}

export function useWorkoutTimer() {
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

  return {
    timer, readFailed, duration, setDuration, error, setError,
    lastHold, seconds, running, save, startCountdown, startStopwatch,
  };
}

export const WorkoutTimerContext = createContext<ReturnType<typeof useWorkoutTimer> | null>(null);
