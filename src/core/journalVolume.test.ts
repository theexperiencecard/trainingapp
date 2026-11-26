import { describe, expect, it } from 'vitest';
import { dailyExerciseTotals } from './journalVolume';

const monday = { day: '2026-11-16', exercise: 'bench', status: 'completed', reps: 12, kg: 40 } as const;
describe('daily volume for one equipment configuration', () => {
  it('groups only recorded sets for the selected exercise and sorts local days', () => {
    const thursday = { ...monday, day: '2026-11-19' };
    const machine = { ...monday, exercise: 'machine', reps: 10, kg: 25 } as const;
    const rows = [thursday, monday, machine, { ...thursday, reps: 11 }];
    expect(dailyExerciseTotals(rows, 'bench')).toEqual([
      { day: monday.day, sets: 1, kg: 480, reps: 12 },
      { day: thursday.day, sets: 2, kg: 920, reps: 23 },
    ]);
    expect(dailyExerciseTotals(rows, 'machine')).toEqual([{ day: monday.day, sets: 1, kg: 250, reps: 10 }]);
  });

  it('withholds a day total if any completed set has an unknown load', () => {
    const missing = { ...monday, kg: null };
    for (const rows of [[missing, monday], [monday, missing]]) {
      expect(dailyExerciseTotals(rows, 'bench')).toEqual([{ day: monday.day, sets: 2, kg: null, reps: 24 }]);
    }
  });

  it('distinguishes an observed zero from an exercise with no entries', () => {
    expect(dailyExerciseTotals([{ ...monday, kg: 0 }], 'bench')).toEqual([{ day: monday.day, sets: 1, kg: 0, reps: 12 }]);
    expect(dailyExerciseTotals([monday], 'machine')).toEqual([]);
    expect(dailyExerciseTotals([{ ...monday, status: 'voided' }, { ...monday, status: 'skipped' }], 'bench')).toEqual([]);
  });
});

it('sums completed bodyweight repetitions separately, preserving the per-side count', () => {
  const bridge = { ...monday, exercise: 'bridge', kg: null, reps: 12 } as const;
  const deadBug = { ...monday, exercise: 'deadBug', kg: null, reps: 8 } as const;
  const rows = [bridge, deadBug, { ...deadBug, reps: 6 },
    { ...deadBug, reps: 5, status: 'skipped' }, { ...bridge, status: 'voided' }] as const;
  expect(dailyExerciseTotals(rows, 'bridge')).toEqual([{ day: monday.day, sets: 1, kg: null, reps: 12 }]);
  expect(dailyExerciseTotals(rows, 'deadBug')).toEqual([{ day: monday.day, sets: 2, kg: null, reps: 14 }]);
});

it('reports an unrepresentable daily repetition total as unavailable', () => {
  const bridge = { ...monday, exercise: 'bridge', kg: null, reps: Number.MAX_SAFE_INTEGER } as const;
  expect(dailyExerciseTotals([bridge, bridge], 'bridge')).toEqual([
    { day: monday.day, sets: 2, kg: null, reps: null },
  ]);
});
