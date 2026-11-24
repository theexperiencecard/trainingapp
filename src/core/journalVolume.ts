import type { Exercise, JournalSet } from '../storage/localJournal';

type VolumeRow = Pick<JournalSet, 'day' | 'exercise' | 'kg' | 'reps' | 'status'>;
type DailyVolume = { day: string; sets: number; kg: number | null };

export function dailyVolumes(rows: readonly VolumeRow[], exercise: Exercise): DailyVolume[] {
  const byDay = new Map<string, DailyVolume>();
  for (const row of rows) {
    if (row.exercise !== exercise || row.status !== 'completed') continue;
    const day = byDay.get(row.day) ?? { day: row.day, sets: 0, kg: 0 };
    if (row.kg === null || day.kg === null) {
      day.kg = null;
    } else {
      const total = day.kg + row.kg * row.reps;
      day.kg = Number.isFinite(total) ? total : null;
    }
    day.sets++;
    byDay.set(day.day, day);
  }
  return [...byDay.values()].sort((a, b) => a.day.localeCompare(b.day));
}
