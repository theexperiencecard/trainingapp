import type { Exercise, JournalSet } from '../storage/localJournal';

type VolumeRow = Pick<JournalSet, 'day' | 'exercise' | 'kg' | 'reps' | 'status'>;
type DailyExerciseTotal = { day: string; sets: number; kg: number | null; reps: number | null };

export function dailyExerciseTotals(rows: readonly VolumeRow[], exercise: Exercise): DailyExerciseTotal[] {
  const byDay = new Map<string, DailyExerciseTotal>();
  for (const row of rows) {
    if (row.exercise !== exercise || row.status !== 'completed') continue;
    const day = byDay.get(row.day) ?? { day: row.day, sets: 0, kg: 0, reps: 0 };
    if (row.kg === null || day.kg === null) {
      day.kg = null;
    } else {
      const total = day.kg + row.kg * row.reps;
      day.kg = Number.isFinite(total) ? total : null;
    }
    if (day.reps !== null) {
      const total = day.reps + row.reps;
      day.reps = Number.isSafeInteger(total) ? total : null;
    }
    day.sets++;
    byDay.set(day.day, day);
  }
  return [...byDay.values()].sort((a, b) => a.day.localeCompare(b.day));
}
