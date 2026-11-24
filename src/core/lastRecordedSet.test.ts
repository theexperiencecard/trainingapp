import { expect, it } from 'vitest';
import type { JournalSet } from '../storage/localJournal';
import { lastRecordedSet } from './lastRecordedSet';

const first: JournalSet = {
  day: '2026-11-23', position: 1, exercise: 'bench', status: 'completed',
  id: 'first', kg: 30, reps: 8, rir: 2, revisions: { kg: 1, reps: 1, rir: 1, status: 1 },
};

it('finds the latest completed set on the selected equipment by training date and position', () => {
  const latest = { ...first, id: 'latest', position: 4, kg: null };
  const rows: JournalSet[] = [
    latest, { ...first, status: 'skipped', position: 5 }, { ...first, status: 'voided', position: 6 },
    { ...first, day: '2026-11-22', position: 7 }, { ...first, day: '2026-11-25' },
    { ...first, exercise: 'machine', position: 8 }, first,
  ];
  expect(lastRecordedSet(rows, 'bench', '2026-11-24')).toBe(latest);
  expect(lastRecordedSet(rows, 'machine', '2026-11-24')?.position).toBe(8);
  expect(lastRecordedSet([first], 'machine', '2026-11-24')).toBeNull();
});
