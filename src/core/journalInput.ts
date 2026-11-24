import { sampleExercises, type Exercise } from './sampleExercises';

export type Measurement = 'kg' | 'reps' | 'rir';

export function localDate(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseDecimal(text: string): number | null {
  const trimmed = text.trim();
  if (trimmed === '') return null;
  return /^\d+(?:[.,]\d+)?$/.test(trimmed) ? Number(trimmed.replace(',', '.')) : Number.NaN;
}

export function validMeasurement(field: Measurement, value: number | null): boolean {
  if (value === null) return field !== 'reps';
  if (!Number.isFinite(value) || value < 0 || value > Number.MAX_SAFE_INTEGER) return false;
  if (field === 'kg') return true;
  return Number.isSafeInteger(value) && (field === 'rir' || value > 0);
}

export function newOperationId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export type SetDraft = Record<Measurement, string>;
export type SetMeasurements = { reps: number; kg: number | null; rir: number | null };

export function exampleDraft(exercise: Exercise): SetDraft {
  const { kg, reps } = sampleExercises[exercise].set;
  return { kg: String(kg), reps: String(reps), rir: '' };
}

export function readSetDraft(draft: SetDraft): SetMeasurements | null {
  const kg = parseDecimal(draft.kg);
  const reps = parseDecimal(draft.reps);
  const rir = parseDecimal(draft.rir);
  if (reps === null || !validMeasurement('reps', reps) || !validMeasurement('kg', kg) ||
      !validMeasurement('rir', rir)) return null;
  return { kg, reps, rir };
}
