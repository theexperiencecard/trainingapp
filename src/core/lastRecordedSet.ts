import type { Exercise, JournalSet } from '../storage/localJournal';

// listSets has already checked the exercise's configuration, unit and load convention.
export function lastRecordedSet(rows: readonly JournalSet[], exercise: Exercise, day: string): JournalSet | null {
  let latest: JournalSet | null = null;
  for (const row of rows) {
    if (row.exercise !== exercise || row.status !== 'completed' || row.day > day) continue;
    if (!latest || row.day > latest.day || (row.day === latest.day && row.position > latest.position)) {
      latest = row;
    }
  }
  return latest;
}
