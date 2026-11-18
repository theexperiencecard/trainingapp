// IndexedDB adapter for the on-device journal. A set and its operation are written in
// one transaction; "saved on the device" is reported only after the commit completes.
import {
  applyEdit, createJournalSet, JOURNAL_FORMAT_VERSION, LOCAL_TRIAL_OWNER,
  type EditResult, type ExerciseKey, type FieldConflict, type JournalSession, type JournalSet,
  type Revisions, type SetFields,
} from '../core/journal';

const DB_NAME = 'trainingapp-journal';
const CHANNEL_NAME = 'trainingapp-journal';
const STORES = ['meta', 'sessions', 'sets', 'operations'] as const;

export type JournalOperation = {
  id: string;
  owner: string;
  entity: 'set';
  entityId: string;
  kind: 'create' | 'edit';
  changes: Partial<SetFields>;
  baseRevisions: Revisions | null;
  recordedAt: string;
  outcome: 'applied' | 'conflict' | 'unchanged';
  conflicts: FieldConflict[];
};

export type JournalErrorReason = 'unavailable' | 'newer-format' | 'missing-set' | 'write-failed';

export class JournalError extends Error {
  readonly reason: JournalErrorReason;

  constructor(reason: JournalErrorReason) {
    super(`Journal error: ${reason}`);
    this.reason = reason;
  }
}

/** Random identifier; falls back to getRandomValues where randomUUID needs HTTPS. */
export function newId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// IndexedDB results are untyped; each caller states the shape it stored.
function request<T = unknown>(req: IDBRequest): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result as T);
    req.onerror = () => reject(req.error ?? new JournalError('write-failed'));
  });
}

/** Runs `work` in one read-write transaction and resolves only once it has committed. */
async function writeTransaction<T>(db: IDBDatabase, work: (tx: IDBTransaction) => Promise<T>): Promise<T> {
  const tx = db.transaction([...STORES], 'readwrite', { durability: 'strict' });
  const committed = new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new JournalError('write-failed'));
    tx.onabort = () => reject(tx.error ?? new JournalError('write-failed'));
  });
  try {
    const result = await work(tx);
    await committed;
    return result;
  } catch (error) {
    try { tx.abort(); } catch { /* already finished */ }
    await committed.catch(() => undefined);
    throw error instanceof JournalError ? error : new JournalError('write-failed');
  }
}

export async function openJournal(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') throw new JournalError('unavailable');
  const open = indexedDB.open(DB_NAME, 1);
  open.onupgradeneeded = () => {
    const db = open.result;
    db.createObjectStore('meta');
    db.createObjectStore('sessions', { keyPath: 'id' }).createIndex('byDate', ['owner', 'actualDate']);
    db.createObjectStore('sets', { keyPath: 'id' }).createIndex('bySession', 'sessionId');
    db.createObjectStore('operations', { keyPath: 'id' });
    open.transaction?.objectStore('meta').put(JOURNAL_FORMAT_VERSION, 'formatVersion');
  };
  let db: IDBDatabase;
  try {
    db = await request<IDBDatabase>(open);
  } catch {
    throw new JournalError('unavailable');
  }
  // Let a newer version of the app upgrade the database instead of being blocked by this tab.
  db.onversionchange = () => db.close();
  const format = await request(db.transaction('meta').objectStore('meta').get('formatVersion'));
  if (typeof format !== 'number' || format > JOURNAL_FORMAT_VERSION) {
    db.close();
    throw new JournalError('newer-format');
  }
  return db;
}

export async function readJournal(db: IDBDatabase): Promise<{ sessions: JournalSession[]; sets: JournalSet[] }> {
  const tx = db.transaction(['sessions', 'sets']);
  const [sessions, sets] = await Promise.all([
    request<JournalSession[]>(tx.objectStore('sessions').getAll()),
    request<JournalSet[]>(tx.objectStore('sets').getAll()),
  ]);
  sessions.sort((a, b) => b.actualDate.localeCompare(a.actualDate));
  sets.sort((a, b) => a.position - b.position);
  return { sessions, sets };
}

/**
 * Saves a new set. Retrying with the same operation ID after a failure or a lost
 * confirmation returns the set already saved instead of creating a duplicate.
 */
export async function recordSet(db: IDBDatabase, input: {
  operationId: string;
  setId: string;
  day: string;
  exerciseKey: ExerciseKey;
  fields: Omit<SetFields, 'deleted'>;
}): Promise<JournalSet> {
  return writeTransaction(db, async (tx) => {
    const sets = tx.objectStore('sets');
    const operations = tx.objectStore('operations');
    const previous = await request<JournalOperation | undefined>(operations.get(input.operationId));
    if (previous) {
      const saved = await request<JournalSet | undefined>(sets.get(previous.entityId));
      if (!saved) throw new JournalError('missing-set');
      return saved;
    }

    const at = new Date().toISOString();
    const sessions = tx.objectStore('sessions');
    let session = await request<JournalSession | undefined>(
      sessions.index('byDate').get([LOCAL_TRIAL_OWNER, input.day]));
    if (!session) {
      session = {
        id: newId(), owner: LOCAL_TRIAL_OWNER, plannedDate: input.day, actualDate: input.day,
        createdAt: at, updatedAt: at,
      };
    }
    const position = await request<number>(sets.index('bySession').count(session.id));
    const set = createJournalSet({
      id: input.setId, sessionId: session.id, position, exerciseKey: input.exerciseKey, fields: input.fields, at,
    });
    const operation: JournalOperation = {
      id: input.operationId, owner: LOCAL_TRIAL_OWNER, entity: 'set', entityId: set.id, kind: 'create',
      changes: set.fields, baseRevisions: null, recordedAt: at, outcome: 'applied', conflicts: [],
    };
    // Sequential writes: a failure leaves no other request pending, and the abort undoes all of them.
    await request(sessions.put({ ...session, updatedAt: at }));
    await request(sets.add(set));
    await request(operations.add(operation));
    return set;
  });
}

/** Applies a confirmed correction, deletion or restore, field by field. */
export async function editSet(db: IDBDatabase, input: {
  operationId: string;
  setId: string;
  changes: Partial<SetFields>;
  baseRevisions: Revisions;
}): Promise<EditResult> {
  return writeTransaction(db, async (tx) => {
    const sets = tx.objectStore('sets');
    const operations = tx.objectStore('operations');
    const stored = await request<JournalSet | undefined>(sets.get(input.setId));
    if (!stored) throw new JournalError('missing-set');
    const previous = await request<JournalOperation | undefined>(operations.get(input.operationId));
    if (previous) return { set: stored, applied: [], conflicts: previous.conflicts };

    const at = new Date().toISOString();
    const result = applyEdit(stored, input.changes, input.baseRevisions, at);
    const outcome = result.conflicts.length > 0 ? 'conflict' : result.applied.length > 0 ? 'applied' : 'unchanged';
    const operation: JournalOperation = {
      id: input.operationId, owner: LOCAL_TRIAL_OWNER, entity: 'set', entityId: stored.id, kind: 'edit',
      changes: input.changes, baseRevisions: input.baseRevisions, recordedAt: at, outcome,
      conflicts: result.conflicts,
    };
    if (result.set !== stored) await request(sets.put(result.set));
    await request(operations.add(operation));
    return result;
  });
}

/** Tells other open tabs that the journal changed; returns a function to stop listening. */
export function watchJournal(onChange: () => void): { notify: () => void; close: () => void } {
  if (typeof BroadcastChannel === 'undefined') return { notify: () => undefined, close: () => undefined };
  const channel = new BroadcastChannel(CHANNEL_NAME);
  channel.onmessage = () => onChange();
  return { notify: () => channel.postMessage('changed'), close: () => channel.close() };
}
