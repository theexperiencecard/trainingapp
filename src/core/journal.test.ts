import { describe, expect, it } from 'vitest';
import {
  applyEdit, createJournalSet, localDate, parseDecimal, validateSetFields, volumeByExercise,
  type ExerciseKey, type JournalSet,
} from './journal';

const at = '2026-11-18T10:00:00.000Z';
const later = '2026-11-18T10:05:00.000Z';

function sampleSet(exerciseKey: ExerciseKey = 'bench', id = 'set-1'): JournalSet {
  const fields = exerciseKey === 'bench'
    ? { load: { value: 40, unit: 'kg' as const }, reps: 12, rir: null }
    : { load: { value: 25, unit: 'kg' as const }, reps: 10, rir: 2 };
  return createJournalSet({ id, sessionId: 'session-1', position: 0, exerciseKey, fields, at });
}

describe('journal input', () => {
  it('uses the local calendar day of the device', () => {
    expect(localDate(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });

  it('accepts a decimal comma and keeps an empty field distinct from zero', () => {
    expect(parseDecimal('42,5')).toBe(42.5);
    expect(parseDecimal(' 0 ')).toBe(0);
    expect(parseDecimal('')).toBeNull();
    expect(parseDecimal('4x')).toBeNaN();
  });

  it('allows an unknown RIR but rejects implausible numbers', () => {
    expect(validateSetFields({ load: { value: 40, unit: 'kg' }, reps: 12, rir: null })).toEqual([]);
    expect(validateSetFields({ load: { value: Number.NaN, unit: 'kg' }, reps: 0, rir: 1.5 }))
      .toEqual(['load', 'reps', 'rir']);
  });

  it('records the effective exercise identity, catalog version and unit', () => {
    const set = sampleSet('machine');
    expect(set).toMatchObject({
      exerciseId: 'chest-press', configId: 'machine-m1', loadConvention: 'indicated',
      catalogVersion: 'demo-2026-11', owner: 'local-trial',
      fields: { load: { value: 25, unit: 'kg' }, reps: 10, rir: 2, deleted: false },
    });
  });
});

describe('field-level edits', () => {
  it('merges independent corrections made from the same starting point', () => {
    const original = sampleSet();
    const base = original.revisions;
    const first = applyEdit(original, { reps: 11 }, base, later);
    const second = applyEdit(first.set, { load: { value: 42.5, unit: 'kg' } }, base, later);

    expect(second.conflicts).toEqual([]);
    expect(second.set.fields).toMatchObject({ reps: 11, load: { value: 42.5, unit: 'kg' } });
    expect(second.set.revisions).toMatchObject({ reps: 2, load: 2 });
  });

  it('keeps the stored value and reports both when the same field diverges', () => {
    const original = sampleSet();
    const base = original.revisions;
    const first = applyEdit(original, { load: { value: 42, unit: 'kg' } }, base, later);
    const second = applyEdit(first.set, { load: { value: 45, unit: 'kg' }, rir: 1 }, base, later);

    expect(second.set.fields.load).toEqual({ value: 42, unit: 'kg' });
    expect(second.set.fields.rir).toBe(1);
    expect(second.conflicts).toEqual([
      { field: 'load', wanted: { value: 45, unit: 'kg' }, stored: { value: 42, unit: 'kg' } },
    ]);
  });

  it('treats an identical concurrent change as already applied', () => {
    const original = sampleSet();
    const first = applyEdit(original, { reps: 10 }, original.revisions, later);
    const second = applyEdit(first.set, { reps: 10 }, original.revisions, later);
    expect(second.conflicts).toEqual([]);
    expect(second.set).toBe(first.set);
  });

  it('does not delete a set changed meanwhile, nor edit a set deleted meanwhile', () => {
    const original = sampleSet();
    const edited = applyEdit(original, { reps: 11 }, original.revisions, later).set;
    const deleteAttempt = applyEdit(edited, { deleted: true }, original.revisions, later);
    expect(deleteAttempt.set.fields.deleted).toBe(false);
    expect(deleteAttempt.conflicts.map((conflict) => conflict.field)).toEqual(['deleted']);

    const deleted = applyEdit(original, { deleted: true }, original.revisions, later).set;
    const editAttempt = applyEdit(deleted, { reps: 9 }, original.revisions, later);
    expect(editAttempt.set.fields).toMatchObject({ deleted: true, reps: 12 });
    expect(editAttempt.conflicts).toEqual([
      { field: 'deleted', wanted: false, stored: true },
      { field: 'reps', wanted: 9, stored: 12 },
    ]);
  });

  it('restores a deleted set when nothing else changed', () => {
    const deleted = applyEdit(sampleSet(), { deleted: true }, sampleSet().revisions, later).set;
    const restored = applyEdit(deleted, { deleted: false }, deleted.revisions, later);
    expect(restored.set.fields.deleted).toBe(false);
    expect(restored.set.revisions.deleted).toBe(3);
  });
});

describe('volume per exercise', () => {
  it('never adds loads of different equipment and skips deleted sets', () => {
    const bench = sampleSet('bench', 'a');
    const benchAgain = sampleSet('bench', 'b');
    const machine = sampleSet('machine', 'c');
    const deleted = applyEdit(sampleSet('bench', 'd'), { deleted: true }, sampleSet().revisions, later).set;

    expect(volumeByExercise([bench, machine, benchAgain, deleted])).toEqual([
      { exerciseKey: 'bench', volume: 960, sets: 2 },
      { exerciseKey: 'machine', volume: 250, sets: 1 },
    ]);
  });
});
