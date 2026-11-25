import { addWalk, listJournal, addSet, editSet, JournalConflict, listSets, setStatus } from '../src/storage/localJournal';

function check(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

async function failure(action: Promise<void>): Promise<Error> {
  try {
    await action;
  } catch (error) {
    if (error instanceof Error) return error;
    throw error;
  }
  throw new Error('Expected the transaction to fail.');
}

// Invoke manually from a Vite origin opened in a fresh browser profile.
export async function verifyLocalJournal(): Promise<void> {
  check((await listSets()).length === 0, 'Use an isolated origin with an empty journal.');
  const day = '2026-11-18';

  // Fail the last write after the session and set writes in the same transaction.
  // eslint-disable-next-line @typescript-eslint/unbound-method -- the wrapper passes its store receiver via call.
  const originalAdd = IDBObjectStore.prototype.add;
  try {
    IDBObjectStore.prototype.add = function (value: unknown, key?: IDBValidKey) {
      if (this.name === 'operations') throw new DOMException('Test storage failure', 'QuotaExceededError');
      return originalAdd.call(this, value, key);
    };
    const error = await failure(addSet('bench-set', day, 'bench'));
    check(error.name === 'QuotaExceededError', 'Injected failure must reach the caller.');
  } finally {
    IDBObjectStore.prototype.add = originalAdd;
  }
  check((await listSets()).length === 0, 'A failed operation must leave no set.');

  await Promise.all([addSet('bench-set', day, 'bench'), addSet('bench-set', day, 'bench')]);
  await addSet('machine-set', day, 'machine');
  const initial = await listSets();
  const [bench, machine] = initial;
  check(initial.length === 2 && bench?.position === 1 && machine?.position === 2,
    'Rollback and retry must preserve the sequence and prevent duplicates.');
  check(bench.exercise === 'bench' && bench.kg === 40 && bench.rir === null, 'Incorrect bench fixture.');
  check(machine.exercise === 'machine' && machine.kg === 25, 'Incorrect machine fixture.');
  await failure(addSet('bench-set', day, 'machine'));
  await failure(addSet('bad-date', '2026-02-30', 'bench'));
  await failure(editSet('invalid', bench, { reps: -1 }));

  await Promise.all([
    editSet('change-load', bench, { kg: 42.5 }),
    editSet('change-rir', bench, { rir: 0 }),
  ]);
  await editSet('change-rir', bench, { rir: 0 });
  const conflict = await failure(editSet('collision', bench, { kg: 45, reps: 9 }));
  check(conflict instanceof JournalConflict && conflict.current.kg === 42.5, 'Missing competing value.');
  const [updated] = await listSets();
  check(updated?.id === bench.id && updated.reps === 12, 'A rejected patch changed the record.');
  check(updated.rir === 0 && updated.kg === 42.5, 'Independent edits must merge.');
  check(updated.revisions.rir === 2 && updated.revisions.kg === 2, 'Retry incremented a revision twice.');

  const staleRemoval = await failure(setStatus('stale-void', bench, 'voided'));
  check(staleRemoval instanceof JournalConflict, 'Void must not conceal a concurrent edit.');
  await setStatus('void', updated, 'voided');
  await setStatus('void', updated, 'voided');
  const lateEdit = await failure(editSet('late-edit', updated, { reps: 15 }));
  check(lateEdit instanceof JournalConflict && lateEdit.current.status === 'voided',
    'An edit using an older snapshot must not revive a voided set.');
  const voided = lateEdit.current;
  check(voided.revisions.status === 2 && voided.kg === 42.5, 'Void must preserve measurements.');
  await setStatus('restore', voided, 'completed');
  const [restored] = await listSets();
  check(restored?.status === 'completed' && restored.revisions.status === 3, 'Restore failed.');
  await Promise.all([addWalk('walk-1', day, 600, 'moderate'), addWalk('walk-1', day, 600, 'moderate')]);
  await failure(addWalk('walk-1', day, 600, 'light'));
  await failure(addWalk('bench-set', day, 5, 'unknown'));
  await failure(addWalk('empty-walk', day, 0, 'moderate'));
  const diary = await listJournal();
  check(diary.sets.length === 2 && diary.walks.length === 1, 'Retry changed the number of entries.');
  check(diary.walks[0]?.position === 3 && diary.walks[0].seconds === 600, 'Walk has incorrect duration or position.');
  check(restored.id === bench.id && restored.kg === 42.5 && restored.rir === 0,
    'Restoring must keep the original identity and measurements.');
}
