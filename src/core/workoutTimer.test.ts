import { describe, expect, it } from 'vitest';
import { createCountdown, createStopwatch, parseStoredTimer, secondsForTimer } from './workoutTimer';

const start = Date.UTC(2026, 10, 18, 9);

describe('workout timer', () => {
  it('derives remaining seconds from the deadline and rounds the partial last second up', () => {
    const timer = createCountdown(start, 90);
    expect(secondsForTimer(timer, start)).toBe(90);
    expect(secondsForTimer(timer, start + 89_001)).toBe(1);
    expect(secondsForTimer(timer, start + 90_000)).toBe(0);
  });

  it('restores a countdown after suspension without counting missed ticks', () => {
    const timer = parseStoredTimer(JSON.stringify(createCountdown(start, 120)));
    if (!timer) throw new Error('Expected a stored countdown');
    expect(secondsForTimer(timer, start + 93_500)).toBe(27);
    expect(secondsForTimer(timer, start + 3_600_000)).toBe(0);
  });

  it('restores elapsed whole seconds and handles a clock before the start', () => {
    const timer = parseStoredTimer(JSON.stringify(createStopwatch(start)));
    if (!timer) throw new Error('Expected a stored stopwatch');
    expect(secondsForTimer(timer, start - 2_000)).toBe(0);
    expect(secondsForTimer(timer, start + 9_999)).toBe(9);
    expect(secondsForTimer(timer, start + 3_600_000)).toBe(3600);
  });

  it('recognizes an empty store', () => {
    expect(parseStoredTimer(null)).toBeNull();
  });

  it.each(['{', 'null', '{}', '[]', '{"kind":"unknown"}'])('rejects corrupt data %s', (raw) => {
    expect(() => parseStoredTimer(raw)).toThrow();
  });
});
