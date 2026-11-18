import { useCallback, useEffect, useRef, useState } from 'react';
import {
  demoCatalog, localDate, parseDecimal, validateSetFields, volumeByExercise,
  type ExerciseKey, type FieldConflict, type JournalSession, type JournalSet, type Revisions, type SetFields,
} from '../core/journal';
import type { Locale } from '../locales/messages';
import it from '../locales/journal-it.json';
import de from '../locales/journal-de.json';
import en from '../locales/journal-en.json';
import { editSet, JournalError, newId, openJournal, readJournal, recordSet, watchJournal } from './journalStore';

const translations = { it, de, en } satisfies Record<Locale, typeof it>;
type Notice = 'saved' | 'editSaved' | 'inputError' | 'saveError' | 'editError' | 'missingSet';
type Draft = { load: string; reps: string; rir: string };
// `seen` is the set as shown when the correction started: only fields changed from it are sent.
type Editing = Draft & { setId: string; seen: SetFields; base: Revisions; operationId: string };
type PendingEdit = { setId: string; changes: Partial<SetFields>; base: Revisions; operationId: string };
type Conflict = { setId: string; conflicts: FieldConflict[] };

const exerciseKeys = Object.keys(demoCatalog) as ExerciseKey[];

function readDraft(draft: Draft): Omit<SetFields, 'deleted'> | null {
  const load = parseDecimal(draft.load);
  const fields = { load: load === null ? null : { value: load, unit: 'kg' as const },
    reps: parseDecimal(draft.reps), rir: parseDecimal(draft.rir) };
  return validateSetFields(fields).length === 0 ? fields : null;
}

function toDraft(set: JournalSet): Draft {
  const { load, reps, rir } = set.fields;
  return { load: load ? String(load.value) : '', reps: reps === null ? '' : String(reps),
    rir: rir === null ? '' : String(rir) };
}

export function LocalJournal({ locale }: { locale: Locale }) {
  const text = translations[locale];
  const number = new Intl.NumberFormat(locale);
  const db = useRef<IDBDatabase | null>(null);
  const channel = useRef<ReturnType<typeof watchJournal> | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable' | 'newerFormat'>('loading');
  const [journal, setJournal] = useState<{ sessions: JournalSession[]; sets: JournalSet[] }>({ sessions: [], sets: [] });
  const [exercise, setExercise] = useState<ExerciseKey>('bench');
  const [draft, setDraft] = useState<Draft>({ load: '40', reps: '12', rir: '' });
  const [createId, setCreateId] = useState(() => ({ operationId: newId(), setId: newId() }));
  const [editing, setEditing] = useState<Editing | null>(null);
  const [failedEdit, setFailedEdit] = useState<PendingEdit | null>(null);
  const [conflict, setConflict] = useState<Conflict | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [busy, setBusy] = useState(false);

  const reload = useCallback(async () => {
    if (db.current) setJournal(await readJournal(db.current));
  }, []);

  useEffect(() => {
    let closed = false;
    openJournal().then(async (opened) => {
      if (closed) return opened.close();
      db.current = opened;
      channel.current = watchJournal(() => void reload());
      await reload();
      setStatus('ready');
    }).catch((error: unknown) => {
      if (!closed) setStatus(error instanceof JournalError && error.reason === 'newer-format' ? 'newerFormat' : 'unavailable');
    });
    const onShow = () => void reload();
    window.addEventListener('pageshow', onShow);
    return () => {
      closed = true;
      window.removeEventListener('pageshow', onShow);
      channel.current?.close();
      db.current?.close();
      db.current = null;
    };
  }, [reload]);

  async function afterWrite(next: Notice) {
    setNotice(next);
    channel.current?.notify();
    await reload();
  }

  async function save() {
    const fields = readDraft(draft);
    if (!fields) return setNotice('inputError');
    if (!db.current) return;
    setBusy(true);
    try {
      await recordSet(db.current, { ...createId, day: localDate(new Date()), exerciseKey: exercise, fields });
      setCreateId({ operationId: newId(), setId: newId() });
      await afterWrite('saved');
    } catch {
      setNotice('saveError'); // keeps the same IDs, so the retry cannot duplicate the set
    } finally {
      setBusy(false);
    }
  }

  async function submitEdit(edit: PendingEdit) {
    if (!db.current) return;
    setBusy(true);
    try {
      const result = await editSet(db.current, { operationId: edit.operationId, setId: edit.setId,
        changes: edit.changes, baseRevisions: edit.base });
      setEditing(null);
      setFailedEdit(null);
      setConflict(result.conflicts.length > 0 ? { setId: edit.setId, conflicts: result.conflicts } : null);
      await afterWrite('editSaved');
    } catch (error) {
      setFailedEdit(edit);
      setNotice(error instanceof JournalError && error.reason === 'missing-set' ? 'missingSet' : 'editError');
    } finally {
      setBusy(false);
    }
  }

  function saveCorrection(current: Editing) {
    const fields = readDraft(current);
    if (!fields) return setNotice('inputError');
    const { seen } = current;
    const changes: Partial<SetFields> = {};
    if (JSON.stringify(fields.load) !== JSON.stringify(seen.load)) changes.load = fields.load;
    if (fields.reps !== seen.reps) changes.reps = fields.reps;
    if (fields.rir !== seen.rir) changes.rir = fields.rir;
    void submitEdit({ setId: current.setId, changes, base: current.base, operationId: current.operationId });
  }

  function applyMine(set: JournalSet, conflicts: FieldConflict[]) {
    const changes = Object.fromEntries(conflicts.map((item) => [item.field, item.wanted])) as Partial<SetFields>;
    void submitEdit({ setId: set.id, changes, base: set.revisions, operationId: newId() });
  }

  // Labels follow the convention frozen in the set, not the current catalog.
  const unitLabel = (set: JournalSet) => text[set.loadConvention === 'total' ? 'total' : 'indicated'];

  function describe(set: JournalSet) {
    const { load, reps, rir } = set.fields;
    const loadText = load ? `${number.format(load.value)} ${unitLabel(set)}` : '—';
    const rirText = rir === null ? text.rirUnknown : `RIR ${number.format(rir)}`;
    return `${text[set.exerciseKey]} · ${loadText} × ${reps ?? '—'} · ${rirText}`;
  }

  function showValue(field: FieldConflict['field'], value: unknown, set: JournalSet) {
    if (field === 'deleted') return value ? text.conflictDeleted : text.conflictPresent;
    if (value === null) return '—';
    if (field === 'load') return `${number.format((value as { value: number }).value)} ${unitLabel(set)}`;
    return number.format(value as number);
  }

  const draftFields = (values: Draft, onChange: (next: Draft) => void) => (
    (['load', 'reps', 'rir'] as const).map((field) => (
      <label key={field} className="journal-field">
        {text[field]}
        <input type="text" inputMode={field === 'load' ? 'decimal' : 'numeric'} value={values[field]}
          aria-invalid={notice === 'inputError'}
          onChange={(event) => { onChange({ ...values, [field]: event.target.value }); setNotice(null); }} />
      </label>
    ))
  );

  if (status !== 'ready') {
    return (
      <section className="session-demo" aria-labelledby="journal-heading">
        <h2 id="journal-heading">{text.heading}</h2>
        {status === 'loading' ? <p>{text.loading}</p> : <p role="alert">{text[status]}</p>}
      </section>
    );
  }

  return (
    <section className="session-demo" aria-labelledby="journal-heading">
      <h2 id="journal-heading">{text.heading}</h2>
      <p>{text.intro}</p>
      <label>
        {text.exercise}
        <select value={exercise} onChange={(event) => {
          const selected = exerciseKeys.find((key) => key === event.target.value);
          if (selected) setExercise(selected);
        }}>
          {exerciseKeys.map((key) => <option key={key} value={key}>{text[key]}</option>)}
        </select>
      </label>
      {draftFields(draft, (next) => {
        setDraft(next);
        setCreateId({ operationId: newId(), setId: newId() });
      })}
      <div className="demo-actions">
        <button type="button" disabled={busy} onClick={() => void save()}>
          {notice === 'saveError' ? text.retry : text.save}
        </button>
      </div>
      <div aria-live="polite">
        {notice && (
          <p role={['saved', 'editSaved'].includes(notice) ? 'status' : 'alert'}>{text[notice]}</p>
        )}
        {failedEdit && notice === 'editError' && (
          <button type="button" disabled={busy} onClick={() => void submitEdit(failedEdit)}>{text.retry}</button>
        )}
      </div>

      {journal.sets.length === 0 && <p>{text.empty}</p>}
      {journal.sessions.map((session) => {
        const sets = journal.sets.filter((set) => set.sessionId === session.id);
        const [year, month, day] = session.actualDate.split('-').map(Number);
        return (
          <div key={session.id} className="demo-history">
            <h3>{new Date(year!, month! - 1, day).toLocaleDateString(locale,
              { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h3>
            <ol>
              {sets.map((set) => (
                <li key={set.id} className={set.fields.deleted ? 'journal-deleted' : undefined}>
                  <span>{set.fields.deleted ? `${text.deleted}: ` : ''}{describe(set)}</span>
                  {editing?.setId === set.id ? (
                    <div className="journal-edit">
                      {draftFields(editing, (next) => setEditing({ ...editing, ...next }))}
                      <div className="demo-actions">
                        <button type="button" disabled={busy} onClick={() => saveCorrection(editing)}>{text.saveEdit}</button>
                        <button type="button" className="demo-secondary" onClick={() => setEditing(null)}>{text.cancel}</button>
                      </div>
                    </div>
                  ) : (
                    <div className="demo-actions">
                      {!set.fields.deleted && (
                        <button type="button" className="demo-secondary" disabled={busy} onClick={() => {
                          setEditing({ ...toDraft(set), setId: set.id, seen: set.fields, base: set.revisions,
                            operationId: newId() });
                          setConflict(null);
                          setNotice(null);
                        }}>{text.edit}</button>
                      )}
                      <button type="button" className="demo-secondary" disabled={busy} onClick={() => void submitEdit({
                        setId: set.id, changes: { deleted: !set.fields.deleted }, base: set.revisions,
                        operationId: newId(),
                      })}>{set.fields.deleted ? text.restore : text.delete}</button>
                    </div>
                  )}
                  {conflict?.setId === set.id && (
                    <div role="alert" className="journal-conflict">
                      <p>{text.conflict}</p>
                      <ul>
                        {conflict.conflicts.map((item) => (
                          <li key={item.field}>{text.conflictLine
                            .replace('{field}', text[item.field])
                            .replace('{stored}', showValue(item.field, item.stored, set))
                            .replace('{wanted}', showValue(item.field, item.wanted, set))}</li>
                        ))}
                      </ul>
                      <div className="demo-actions">
                        <button type="button" className="demo-secondary" onClick={() => setConflict(null)}>{text.keepStored}</button>
                        <button type="button" disabled={busy} onClick={() => applyMine(set, conflict.conflicts)}>{text.useMine}</button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ol>
            <h4>{text.volume}</h4>
            <dl>
              {volumeByExercise(sets).map((line) => (
                <div key={line.exerciseKey}>
                  <dt>{text[line.exerciseKey]}</dt>
                  <dd>{number.format(line.volume)} {text[demoCatalog[line.exerciseKey].loadConvention]}</dd>
                </div>
              ))}
            </dl>
          </div>
        );
      })}
    </section>
  );
}
