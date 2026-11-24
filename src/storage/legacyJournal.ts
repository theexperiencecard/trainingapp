// The earlier preview used a different database and a fixed two-exercise catalog.
const name = 'trainingapp-journal';
const owner = 'local-trial';

export type LegacySet = {
  id: string; day: string; position: number; exercise: 'bench' | 'machine';
  kg: number | null; reps: number; rir: number | null; deleted: boolean;
};

function existingDatabase(): Promise<IDBDatabase | null> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name);
    let absent = false;
    request.onupgradeneeded = () => {
      // Also handles deletion between databases() and open(). Never commit a new database.
      absent = true;
      request.transaction?.abort();
    };
    request.onerror = () => absent ? resolve(null) : reject(request.error ?? new Error('Legacy database request failed'));
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => db.close();
      resolve(db);
    };
  });
}

export async function hasLegacyJournal(): Promise<boolean> {
  if (typeof indexedDB === 'undefined') return false;
  if (typeof indexedDB.databases === 'function') {
    return (await indexedDB.databases()).some(db => db.name === name);
  }
  const db = await existingDatabase();
  db?.close();
  return db !== null;
}

function read<T>(request: IDBRequest<T>): Promise<unknown> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Legacy database request failed'));
  });
}

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function nonnegative(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function decode(row: unknown, sessionId: string, day: string): LegacySet | null {
  if (!object(row) || row.owner !== owner) return null;
  const { exerciseKey, position, fields } = row;
  if (row.sessionId !== sessionId || row.catalogVersion !== 'demo-2026-11' ||
      typeof row.id !== 'string' || !nonnegative(position) || !Number.isSafeInteger(position) ||
      row.status !== 'done' || !object(fields) || typeof fields.deleted !== 'boolean') {
    throw new Error('Unknown legacy record');
  }
  const bench = exerciseKey === 'bench' && row.exerciseId === 'bench-press' && row.configId === 'barbell' && row.loadConvention === 'total';
  const machine = exerciseKey === 'machine' && row.exerciseId === 'chest-press' && row.configId === 'machine-m1' && row.loadConvention === 'indicated';
  const { load, reps, rir } = fields;
  if ((!bench && !machine) || !nonnegative(reps) || !Number.isSafeInteger(reps) || reps < 1 ||
      (rir !== null && (!nonnegative(rir) || !Number.isSafeInteger(rir)))) throw new Error('Unsupported measurement');
  let kg = null;
  if (load !== null) {
    if (!object(load) || load.unit !== 'kg' || !nonnegative(load.value)) throw new Error('Unsupported load');
    kg = load.value;
  }
  return { id: row.id, day, position, exercise: bench ? 'bench' : 'machine', kg, reps, rir, deleted: fields.deleted };
}

export async function readLegacyJournal(): Promise<LegacySet[]> {
  const db = await existingDatabase();
  if (!db) return [];
  try {
    if (db.version !== 1) throw new Error('Unknown database version');
    const tx = db.transaction(['meta', 'sessions', 'sets'], 'readonly');
    const format = await read(tx.objectStore('meta').get('formatVersion'));
    if (format !== 1) throw new Error('Unknown journal format');
    const range = IDBKeyRange.bound([owner, ''], [owner, '\uffff']);
    const sessions: unknown = await read(tx.objectStore('sessions').index('byDate').getAll(range));
    if (!Array.isArray(sessions)) throw new Error('Unknown session format');
    const groups = await Promise.all(sessions.map(async (session: unknown) => {
      if (!object(session) || session.owner !== owner || typeof session.id !== 'string' ||
          typeof session.actualDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(session.actualDate)) throw new Error('Invalid session');
      const records: unknown = await read(tx.objectStore('sets').index('bySession').getAll(session.id));
      if (!Array.isArray(records)) throw new Error('Unknown set format');
      const result: LegacySet[] = [];
      for (const row of records as unknown[]) {
        const set = decode(row, session.id, session.actualDate);
        if (set) result.push(set);
      }
      return result;
    }));
    return groups.flat().sort((a, b) => b.day.localeCompare(a.day) || a.position - b.position);
  } finally {
    db.close();
  }
}
