import { describe, expect, it } from 'vitest';
import { estimateSessionSeconds } from './sessionTiming';

describe('session duration', () => {
  it('includes preparation, execution and rest on the same station', () => {
    expect(estimateSessionSeconds({
      preparationSeconds: 120, setSeconds: [45, 45],
      gaps: [{ recoverySeconds: 120, changeSeconds: 0, overlap: false }],
    })).toBe(330);
  });

  it('uses the longer interval for overlapping tasks and adds sequential tasks', () => {
    const estimate = (overlap: boolean) => estimateSessionSeconds({
      preparationSeconds: 0, setSeconds: [45, 45],
      gaps: [{ recoverySeconds: 120, changeSeconds: 75, overlap }],
    });
    expect(estimate(true)).toBe(210);
    expect(estimate(false)).toBe(285);
  });

  it('preserves the 33.5 minute example when the four exercise changes also require rest', () => {
    const gap = { recoverySeconds: 120, changeSeconds: 0, overlap: true };
    const times = {
      preparationSeconds: 8 * 60,
      setSeconds: Array<number>(10).fill(45),
      gaps: Array.from({ length: 9 }, (_, index) =>
        index % 2 === 0 ? gap : { ...gap, changeSeconds: 75 },
      ),
    };
    expect(estimateSessionSeconds(times)).toBe(33.5 * 60);
    expect(estimateSessionSeconds({
      ...times,
      gaps: times.gaps.map((interval) =>
        interval.changeSeconds > 0 ? { ...interval, recoverySeconds: 0 } : interval,
      ),
    })).toBe(30.5 * 60);
  });

  it('rejects missing intervals and invalid durations instead of reporting a short estimate', () => {
    expect(() => estimateSessionSeconds({
      preparationSeconds: 0, setSeconds: [45, 45], gaps: [],
    })).toThrow(RangeError);
    expect(() => estimateSessionSeconds({
      preparationSeconds: 0, setSeconds: [45, 45],
      gaps: [{ recoverySeconds: -30, changeSeconds: 0, overlap: true }],
    })).toThrow(RangeError);
  });
});
