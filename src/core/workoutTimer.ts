export const TIMER_STORAGE_KEY = 'trainingapp.workoutTimer.v1';

export type TimerState =
  | { kind: 'countdown'; endAt: number }
  | { kind: 'stopwatch'; startedAt: number };

function validTime(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

export function createCountdown(nowMs: number, durationSeconds: number): TimerState {
  const endAt = nowMs + durationSeconds * 1000;
  if (!validTime(nowMs) || !Number.isSafeInteger(durationSeconds) || durationSeconds <= 0 || !validTime(endAt)) {
    throw new RangeError('Invalid countdown duration or timestamp');
  }
  return { kind: 'countdown', endAt };
}

export function createStopwatch(nowMs: number): TimerState {
  if (!validTime(nowMs)) throw new RangeError('Invalid start timestamp');
  return { kind: 'stopwatch', startedAt: nowMs };
}

export function secondsForTimer(timer: TimerState, nowMs: number): number {
  if (timer.kind === 'countdown') return Math.max(0, Math.ceil((timer.endAt - nowMs) / 1000));
  return Math.max(0, Math.floor((nowMs - timer.startedAt) / 1000));
}

export function parseStoredTimer(raw: string | null): TimerState | null {
  if (raw === null) return null;
  const value: unknown = JSON.parse(raw);
  if (typeof value === 'object' && value !== null && 'kind' in value) {
    if (value.kind === 'countdown' && 'endAt' in value && validTime(value.endAt)) {
      return { kind: 'countdown', endAt: value.endAt };
    }
    if (value.kind === 'stopwatch' && 'startedAt' in value && validTime(value.startedAt)) {
      return { kind: 'stopwatch', startedAt: value.startedAt };
    }
  }
  throw new Error('Invalid stored workout timer');
}
