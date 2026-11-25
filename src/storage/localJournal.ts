import { validMeasurement } from '../core/journalInput';
import { sampleExercises, type Exercise } from '../core/sampleExercises';

export type { Exercise } from '../core/sampleExercises';
export type SetStatus = 'completed' | 'skipped' | 'voided';

export type JournalSet = {
  id: string;
  day: string;
  exercise: Exercise;
  reps: number;
  rir: number | null;
  kg: number | null;
  status: SetStatus;
  revisions: { reps: number; rir: number; kg: number; status: number };
  position: number;
};

export const walkIntensities = ['light', 'moderate', 'vigorous', 'unknown'] as const;
export type WalkIntensity = typeof walkIntensities[number];
export type JournalWalk = {
  id: string;
  sessionId: string;
  owner: string;
  day: string;
  position: number;
  activity: 'walking';
  seconds: number;
  intensity: WalkIntensity;
};

type Measurements = Pick<JournalSet, 'kg' | 'reps' | 'rir'>;
type Patch = Partial<Measurements>;
type Field = keyof Patch;
const fields: Field[] = ['kg', 'reps', 'rir'];
const owner = 'synthetic';
const databaseName = 'trainingapp-synthetic-journal';

type SavedSet = JournalSet & {
  owner: string;
  sessionId: string;
  catalogVersion: number;
  configuration: string;
  convention: string;
  unit: 'kg';
  createdAt: number;
  modifiedAt: number;
};

type Session = {
  id: string;
  owner: string;
  plannedDay: string;
  actualDay: string;
  createdAt: number;
  modifiedAt: number;
  nextPosition: number;
};

export class JournalConflict extends Error {
  readonly current: JournalSet;

  constructor(current: JournalSet) {
    super('A journal field changed in another transaction.');
    this.name = 'JournalConflict';
    this.current = current;
  }
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 2);
    let blocked = false;
    request.onupgradeneeded = event => {
      const db = request.result;
      if (event.oldVersion === 0) {
        db.createObjectStore('sessions', { keyPath: 'id' });
        db.createObjectStore('sets', { keyPath: 'id' });
        db.createObjectStore('operations', { keyPath: 'id' });
      }
      db.createObjectStore('walks', { keyPath: 'id' });
    };
    request.onblocked = () => {
      blocked = true;
      reject(new Error('Another connection is blocking the journal.'));
    };
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => db.close();
      if (blocked) db.close();
      else resolve(db);
    };
    request.onerror = () => reject(request.error ?? new Error('Journal request failed.'));
  });
}

function result<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Journal request failed.'));
  });
}

// Only IndexedDB requests may be awaited inside work so the transaction stays active.
async function transact<T>(mode: IDBTransactionMode, work: (tx: IDBTransaction) => Promise<T>): Promise<T> {
  const db = await openDatabase();
  try {
    const stores = mode === 'readonly' ? ['sets', 'walks'] : ['sets', 'walks', 'sessions', 'operations'];
    const tx = db.transaction(stores, mode, mode === 'readwrite' ? { durability: 'strict' } : {});
    const finished = new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(tx.error ?? new Error('Journal transaction aborted.'));
    });
    const task = work(tx).catch((error: unknown) => {
      try { tx.abort(); } catch { /* Already aborted by IndexedDB. */ }
      throw error;
    });
    const [value] = await Promise.all([task, finished]);
    return value;
  } finally {
    db.close();
  }
}

function validDay(day: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const date = new Date(day + 'T12:00:00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === day;
}

function validateField(field: Field, value: number | null | undefined) {
  if (value === undefined || !validMeasurement(field, value)) {
    throw new RangeError('Invalid journal measurement.');
  }
}

function checkSet(row: SavedSet): SavedSet {
  const expected = sampleExercises[row.exercise]?.set;
  if (row.owner !== owner || row.catalogVersion !== 1 || !expected ||
      row.configuration !== expected.configuration || row.convention !== expected.convention ||
      row.unit !== 'kg' || !['completed', 'skipped', 'voided'].includes(row.status) || !validDay(row.day) ||
      row.sessionId !== owner + ':' + row.day || !Number.isSafeInteger(row.position) || row.position < 1) {
    throw new Error('Unsupported journal record.');
  }
  for (const field of fields) {
    validateField(field, row[field]);
    if (!Number.isSafeInteger(row.revisions[field]) || row.revisions[field] < 1) {
      throw new Error('Invalid journal revision.');
    }
  }
  // The first v1 sample only stored completed sets, before status revisions were used.
  if (row.revisions.status === undefined && row.status === 'completed') {
    return { ...row, revisions: { ...row.revisions, status: 1 } };
  }
  if (!Number.isSafeInteger(row.revisions.status) || row.revisions.status < 1) {
    throw new Error('Invalid journal status revision.');
  }
  return row;
}

async function readSets(tx: IDBTransaction): Promise<JournalSet[]> {
  const rows = await result(tx.objectStore('sets').getAll() as IDBRequest<SavedSet[]>);
  return rows.map(checkSet).sort(byDayAndPosition);
}

function byDayAndPosition(a: { day: string; position: number }, b: { day: string; position: number }) {
  return b.day.localeCompare(a.day) || a.position - b.position;
}

export function listSets(): Promise<JournalSet[]> {
  return transact('readonly', readSets);
}

export function listJournal() {
  return transact('readonly', async tx => {
    const [sets, walks] = await Promise.all([
      readSets(tx), result(tx.objectStore('walks').getAll() as IDBRequest<JournalWalk[]>),
    ]);
    for (const walk of walks) {
      if (walk.owner !== owner || walk.activity !== 'walking' || walk.sessionId !== owner + ':' + walk.day ||
          !Number.isSafeInteger(walk.position) || walk.position < 1) throw new Error('Unsupported walk.');
      validateWalk(walk.day, walk.seconds, walk.intensity);
    }
    return { sets, walks: walks.sort(byDayAndPosition) };
  });
}

async function applyOnce(
  opId: string, entityId: string, intent: object, apply: (tx: IDBTransaction, now: number) => Promise<void>,
): Promise<void> {
  if (typeof opId !== 'string' || !opId.trim()) throw new Error('A stable operation ID is required.');
  const signature = JSON.stringify([entityId, intent]);
  await transact('readwrite', async (tx) => {
    const operations = tx.objectStore('operations');
    const prior = await result(operations.get(opId) as IDBRequest<{ signature: string } | undefined>);
    if (prior) {
      if (prior.signature !== signature) throw new Error('This operation ID was used for a different change.');
      return;
    }
    const now = Date.now();
    await apply(tx, now);
    const target = entityId.startsWith(owner + ':walk:') ? { walkId: entityId } : { setId: entityId };
    await result(operations.add({ id: opId, owner, ...target, intent, signature, modifiedAt: now }));
  });
}

export function addedSetId(opId: string): string {
  return owner + ':set:' + opId;
}

export async function addSet(
  opId: string, day: string, exercise: Exercise, input?: Measurements,
): Promise<void> {
  if (!validDay(day) || !Object.hasOwn(sampleExercises, exercise)) throw new Error('Invalid sample set.');
  const fixture = sampleExercises[exercise].set;
  const measurement = input ? { ...input } : { kg: fixture.kg, reps: fixture.reps, rir: null };
  for (const field of fields) validateField(field, measurement[field]);
  const sessionId = owner + ':' + day;
  const id = addedSetId(opId);
  // Keep the v1 default operation signature stable when the same input is retried.
  const intent = {
    type: 'add', day, exercise, catalogVersion: 1, ...fixture,
    kg: measurement.kg, reps: measurement.reps, unit: 'kg', rir: measurement.rir,
  };
  await applyOnce(opId, id, intent, async (tx, now) => {
    const position = await nextPosition(tx, day, now);
    const set: SavedSet = {
      id, sessionId, owner, day, exercise, ...fixture,
      kg: measurement.kg, reps: measurement.reps, rir: measurement.rir, unit: 'kg',
      status: 'completed', catalogVersion: 1, position,
      revisions: { kg: 1, reps: 1, rir: 1, status: 1 }, createdAt: now, modifiedAt: now,
    };
    await result(tx.objectStore('sets').add(checkSet(set)));
  });
}

async function nextPosition(tx: IDBTransaction, day: string, now: number): Promise<number> {
  const sessions = tx.objectStore('sessions');
  const id = owner + ':' + day;
  const stored = await result(sessions.get(id) as IDBRequest<Session | undefined>);
  const session = stored ?? {
    id, owner, plannedDay: day, actualDay: day, nextPosition: 1, createdAt: now, modifiedAt: now,
  };
  await result(sessions.put({ ...session, nextPosition: session.nextPosition + 1, modifiedAt: now }));
  return session.nextPosition;
}

function validateWalk(day: string, seconds: number, intensity: WalkIntensity) {
  if (!validDay(day) || !Number.isSafeInteger(seconds) || seconds < 1 || seconds > 86400 ||
      !walkIntensities.includes(intensity)) throw new RangeError('Invalid walking segment.');
}

export async function addWalk(opId: string, day: string, seconds: number, intensity: WalkIntensity): Promise<void> {
  validateWalk(day, seconds, intensity);
  const id = owner + ':walk:' + opId;
  const intent = { type: 'addWalk', day, seconds, intensity };
  await applyOnce(opId, id, intent, async (tx, now) => {
    const position = await nextPosition(tx, day, now);
    const walk: JournalWalk = { id, owner, sessionId: owner + ':' + day, day, position, activity: 'walking', seconds, intensity };
    await result(tx.objectStore('walks').add(walk));
  });
}

async function loadSet(tx: IDBTransaction, base: JournalSet): Promise<SavedSet> {
  const request = tx.objectStore('sets').get(base.id) as IDBRequest<SavedSet | undefined>;
  const stored = await result(request);
  if (!stored) throw new Error('The set no longer exists.');
  const current = checkSet(stored);
  if (base.exercise !== current.exercise || base.day !== current.day ||
      base.status !== current.status || base.revisions.status !== current.revisions.status) {
    throw new JournalConflict(current);
  }
  return current;
}

async function updateSet(tx: IDBTransaction, next: SavedSet): Promise<void> {
  await result(tx.objectStore('sets').put(next));
  const sessions = tx.objectStore('sessions');
  const session = await result(sessions.get(next.sessionId) as IDBRequest<Session | undefined>);
  if (!session) throw new Error('The session no longer exists.');
  await result(sessions.put({ ...session, modifiedAt: next.modifiedAt }));
}

export async function editSet(opId: string, base: JournalSet, patch: Patch): Promise<void> {
  const changes = fields.filter(field => Object.hasOwn(patch, field));
  if (changes.length === 0 || Object.keys(patch).length !== changes.length) {
    throw new Error('Only measurement fields may be changed.');
  }
  const edits = changes.map(field => {
    validateField(field, patch[field]);
    if (!Number.isSafeInteger(base.revisions[field]) || base.revisions[field] < 1) {
      throw new Error('Invalid starting revision.');
    }
    return { field, value: patch[field], baseRevision: base.revisions[field] };
  });
  const intent = { type: 'edit', statusRevision: base.revisions.status, edits };
  await applyOnce(opId, base.id, intent, async (tx, now) => {
    const current = await loadSet(tx, base);
    if (current.status !== 'completed') throw new JournalConflict(current);
    const next = { ...current, revisions: { ...current.revisions }, modifiedAt: now };
    for (const { field, value, baseRevision } of edits) {
      if (current[field] === value) continue;
      if (current.revisions[field] !== baseRevision) throw new JournalConflict(current);
      Object.assign(next, { [field]: value });
      next.revisions[field] += 1;
    }
    await updateSet(tx, next);
  });
}

export async function setStatus(opId: string, base: JournalSet, next: SetStatus): Promise<void> {
  if (!['completed', 'skipped', 'voided'].includes(next)) throw new Error('Invalid journal status.');
  const intent = { type: 'status', next, revisions: {
    kg: base.revisions.kg, reps: base.revisions.reps, rir: base.revisions.rir, status: base.revisions.status,
  } };
  await applyOnce(opId, base.id, intent, async (tx, now) => {
    const current = await loadSet(tx, base);
    if (fields.some(field => base.revisions[field] !== current.revisions[field])) {
      throw new JournalConflict(current);
    }
    if (current.status === next) return;
    await updateSet(tx, {
      ...current, status: next, modifiedAt: now,
      revisions: { ...current.revisions, status: current.revisions.status + 1 },
    });
  });
}
