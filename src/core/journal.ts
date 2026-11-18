// Pure rules for the first on-device journal (docs/30-proposta-diario-locale.md).
// No storage, network or UI here: the IndexedDB adapter lives in src/app/journalStore.ts.

export const JOURNAL_FORMAT_VERSION = 1;
export const DEMO_CATALOG_VERSION = 'demo-2026-11';
export const LOCAL_TRIAL_OWNER = 'local-trial';

// Synthetic catalog of the internal preview. Each entry is a distinct identity:
// loads of different equipment are never added together or converted.
export const demoCatalog = {
  bench: { exerciseId: 'bench-press', configId: 'barbell', loadConvention: 'total' },
  machine: { exerciseId: 'chest-press', configId: 'machine-m1', loadConvention: 'indicated' },
} as const;

export type ExerciseKey = keyof typeof demoCatalog;
export type Load = { value: number; unit: 'kg' };

// Editable fields. A missing value is null, never zero.
export type SetFields = {
  load: Load | null;
  reps: number | null;
  rir: number | null;
  deleted: boolean;
};
export type FieldName = keyof SetFields;
export type Revisions = Record<FieldName, number>;
export const fieldNames: readonly FieldName[] = ['load', 'reps', 'rir', 'deleted'];

export type JournalSession = {
  id: string;
  owner: string;
  plannedDate: string;
  actualDate: string;
  createdAt: string;
  updatedAt: string;
};

export type JournalSet = {
  id: string;
  sessionId: string;
  owner: string;
  position: number;
  catalogVersion: string;
  exerciseKey: ExerciseKey;
  exerciseId: string;
  configId: string;
  loadConvention: string;
  status: 'done';
  fields: SetFields;
  revisions: Revisions;
  createdAt: string;
  updatedAt: string;
};

export type FieldConflict = { field: FieldName; wanted: unknown; stored: unknown };

export type EditResult = { set: JournalSet; applied: FieldName[]; conflicts: FieldConflict[] };

/** Local calendar day (YYYY-MM-DD) in the device time zone. */
export function localDate(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * Reads a decimal typed by the user, accepting a comma as decimal separator.
 * Returns null for an empty field and NaN for text that is not a number.
 */
export function parseDecimal(text: string): number | null {
  const trimmed = text.trim();
  if (trimmed === '') return null;
  return /^\d+([.,]\d+)?$/.test(trimmed) ? Number(trimmed.replace(',', '.')) : Number.NaN;
}

export type SetInputError = 'load' | 'reps' | 'rir';

// Technical plausibility limits for typed values, not training rules.
export function validateSetFields(fields: Omit<SetFields, 'deleted'>): SetInputError[] {
  const errors: SetInputError[] = [];
  const load = fields.load?.value;
  if (load !== undefined && !(Number.isFinite(load) && load >= 0 && load <= 1000)) errors.push('load');
  if (!(fields.reps !== null && Number.isInteger(fields.reps) && fields.reps >= 1 && fields.reps <= 999)) {
    errors.push('reps');
  }
  if (fields.rir !== null && !(Number.isInteger(fields.rir) && fields.rir >= 0 && fields.rir <= 10)) {
    errors.push('rir');
  }
  return errors;
}

export function createJournalSet(input: {
  id: string;
  sessionId: string;
  position: number;
  exerciseKey: ExerciseKey;
  fields: Omit<SetFields, 'deleted'>;
  at: string;
}): JournalSet {
  return {
    id: input.id,
    sessionId: input.sessionId,
    owner: LOCAL_TRIAL_OWNER,
    position: input.position,
    catalogVersion: DEMO_CATALOG_VERSION,
    exerciseKey: input.exerciseKey,
    ...demoCatalog[input.exerciseKey],
    status: 'done',
    fields: { ...input.fields, deleted: false },
    revisions: { load: 1, reps: 1, rir: 1, deleted: 1 },
    createdAt: input.at,
    updatedAt: input.at,
  };
}

function sameValue(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Applies a confirmed edit field by field against the revisions the user saw.
 * Independent fields merge; a field changed meanwhile to a different value is a
 * conflict and keeps the stored value. Deleting or restoring the set conflicts with
 * any concurrent change, and vice versa, so both intentions stay visible.
 */
export function applyEdit(
  set: JournalSet,
  changes: Partial<SetFields>,
  base: Revisions,
  at: string,
): EditResult {
  const changed = fieldNames.filter((field) => field in changes);
  const deletionMoved = set.revisions.deleted !== base.deleted;
  const otherMoved = fieldNames.some((field) => field !== 'deleted' && set.revisions[field] !== base[field]);
  const fields = { ...set.fields };
  const revisions = { ...set.revisions };
  const applied: FieldName[] = [];
  const conflicts: FieldConflict[] = [];

  for (const field of changed) {
    const wanted = changes[field];
    const stored = set.fields[field];
    const moved = field === 'deleted' ? deletionMoved || otherMoved : deletionMoved || set.revisions[field] !== base[field];
    if (sameValue(wanted, stored)) continue;
    if (moved) {
      conflicts.push({ field, wanted, stored });
      continue;
    }
    Object.assign(fields, { [field]: wanted });
    revisions[field] += 1;
    applied.push(field);
  }

  // An edit on a set deleted or restored meanwhile also reports that change, so the
  // person sees why it was not applied and can restore the set explicitly.
  if (deletionMoved && conflicts.length > 0 && !conflicts.some((item) => item.field === 'deleted')) {
    conflicts.unshift({ field: 'deleted', wanted: !set.fields.deleted, stored: set.fields.deleted });
  }
  if (applied.length === 0) return { set, applied, conflicts };
  return { set: { ...set, fields, revisions, updatedAt: at }, applied, conflicts };
}

export type VolumeLine = { exerciseKey: ExerciseKey; volume: number; sets: number };

/** Load × reps per exercise identity; deleted sets and sets without a load are excluded. */
export function volumeByExercise(sets: readonly JournalSet[]): VolumeLine[] {
  const lines = new Map<string, VolumeLine>();
  for (const set of sets) {
    const { load, reps, deleted } = set.fields;
    if (deleted || load === null || reps === null) continue;
    const key = [set.catalogVersion, set.exerciseId, set.configId, set.loadConvention, load.unit].join('|');
    const line = lines.get(key) ?? { exerciseKey: set.exerciseKey, volume: 0, sets: 0 };
    line.volume += load.value * reps;
    line.sets += 1;
    lines.set(key, line);
  }
  return [...lines.values()];
}
