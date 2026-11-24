import { describe, expect, it } from 'vitest';
import { dailyVolumes } from './journalVolume';

const monday = { day: '2026-11-16', exercise: 'bench', status: 'completed', reps: 12, kg: 40 } as const;
describe('daily volume for one equipment configuration', () => {
  it('groups only recorded sets for the selected exercise and sorts local days', () => {
    const thursday = { ...monday, day: '2026-11-19' };
    const machine = { ...monday, exercise: 'machine', reps: 10, kg: 25 } as const;
    const rows = [thursday, monday, machine, { ...thursday, reps: 11 }];
    expect(dailyVolumes(rows, 'bench')).toEqual([
      { day: monday.day, sets: 1, kg: 480 },
      { day: thursday.day, sets: 2, kg: 920 },
    ]);
    expect(dailyVolumes(rows, 'machine')).toEqual([{ day: monday.day, sets: 1, kg: 250 }]);
  });

  it('withholds a day total if any completed set has an unknown load', () => {
    const missing = { ...monday, kg: null };
    for (const rows of [[missing, monday], [monday, missing]]) {
      expect(dailyVolumes(rows, 'bench')).toEqual([{ day: monday.day, sets: 2, kg: null }]);
    }
  });

  it('distinguishes an observed zero from an exercise with no entries', () => {
    expect(dailyVolumes([{ ...monday, kg: 0 }], 'bench')).toEqual([{ day: monday.day, sets: 1, kg: 0 }]);
    expect(dailyVolumes([monday], 'machine')).toEqual([]);
    expect(dailyVolumes([{ ...monday, status: 'voided' }, { ...monday, status: 'skipped' }], 'bench')).toEqual([]);
  });
});
