import { useCallback, useEffect, useRef, useState } from 'react';
import type { Locale } from '../locales/messages';
import { localDate, newOperationId, parseDecimal, validMeasurement } from '../core/journalInput';
import { journalChannel, notifyJournal } from './journalUpdates';
import { sampleExerciseIds, sampleExercises } from '../core/sampleExercises';
import { JournalChart } from './JournalChart';
import './localJournal.css';
import de from '../locales/journal-de.json';
import en from '../locales/journal-en.json';
import it from '../locales/journal-it.json';
import {
  addSet, editSet, JournalConflict, listSets, setStatus, type Exercise, type JournalSet, type SetStatus,
} from '../storage/localJournal';

const translations = { it, de, en } satisfies Record<Locale, typeof it>;
const statuses: readonly SetStatus[] = ['completed', 'skipped', 'voided'];
const fields = ['reps', 'kg', 'rir', 'status'] as const;
type Field = typeof fields[number];
type Editor = { base: JournalSet; field: Field; value: string; conflict?: JournalSet };

type Measurement = Exclude<Field, 'status'>;
type Draft = Record<Measurement, string>;
const measures: readonly Measurement[] = ['kg', 'reps', 'rir'];
function initialDraft(exercise: Exercise): Draft {
  const { kg, reps } = sampleExercises[exercise].set;
  return { kg: String(kg), reps: String(reps), rir: '' };
}

const initialDrafts = { bench: initialDraft('bench'), machine: initialDraft('machine') };

function startEdit(base: JournalSet, field: Field, locale: Locale): Editor {
  const value = base[field];
  const draft = typeof value === 'number'
    ? value.toLocaleString(locale, { useGrouping: false, maximumFractionDigits: 20 })
    : value ?? '';
  return { base, field, value: draft };
}

export function LocalJournal({ locale }: { locale: Locale }) {
  const text = translations[locale];
  const [sets, setSets] = useState<JournalSet[] | null>(null);
  const [exercise, setExercise] = useState<Exercise>('bench');
  const [drafts, setDrafts] = useState(initialDrafts);
  const draft = drafts[exercise];
  const [readFailure, setReadFailure] = useState<'readError' | 'newerFormat' | null>(null);
  const [message, setMessage] = useState<'saved' | 'writeError' | 'invalid' | null>(null);
  const [busy, setBusy] = useState(false);
  const [editor, setEditor] = useState<Editor | null>(null);
  const writing = useRef(false);
  const operation = useRef<{ key: string; id: string } | null>(null);
  const pendingAdd = useRef<{ day: string; intent: string } | null>(null);
  const returnFocus = useRef<HTMLButtonElement | null>(null);
  const channel = useRef<BroadcastChannel | null>(null);
  const readVersion = useRef(0);

  useEffect(() => {
    if (!editor && !busy && returnFocus.current) {
      returnFocus.current.focus();
      returnFocus.current = null;
    }
  }, [editor, busy]);

  const refresh = useCallback(async () => {
    const version = ++readVersion.current;
    try {
      const rows = await listSets();
      if (readVersion.current === version) {
        setSets(rows);
        setReadFailure(null);
      }
    } catch (error) {
      if (readVersion.current === version) {
        setReadFailure(error instanceof DOMException && error.name === 'VersionError' ? 'newerFormat' : 'readError');
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    const reload = () => { if (active) void refresh(); };
    queueMicrotask(reload);
    window.addEventListener('focus', reload);
    window.addEventListener(journalChannel, reload);
    window.addEventListener('pageshow', reload);
    try {
      const connection = new BroadcastChannel(journalChannel);
      connection.onmessage = reload;
      channel.current = connection;
    } catch {
      // Browsers without a channel still reload the journal on focus.
    }
    return () => {
      active = false;
      window.removeEventListener('focus', reload);
      window.removeEventListener(journalChannel, reload);
      window.removeEventListener('pageshow', reload);
      channel.current?.close();
      channel.current = null;
    };
  }, [refresh]);

  async function write(key: string, persist: (id: string) => Promise<void>, keepEditor = false) {
    if (writing.current) return;
    writing.current = true;
    setBusy(true);
    setMessage(null);
    try {
      if (operation.current?.key !== key) {
        operation.current = { key, id: newOperationId() };
      }
      await persist(operation.current.id);
    } catch (error) {
      if (error instanceof JournalConflict && editor) {
        setEditor({ ...editor, conflict: error.current });
      } else {
        setMessage('writeError');
      }
      writing.current = false;
      setBusy(false);
      return;
    }
    operation.current = null;
    pendingAdd.current = null;
    if (!keepEditor) setEditor(null);
    setMessage('saved');
    notifyJournal(channel.current);
    await refresh();
    writing.current = false;
    setBusy(false);
  }

  function add() {
    const kg = parseDecimal(draft.kg);
    const reps = parseDecimal(draft.reps);
    const rir = parseDecimal(draft.rir);
    if (reps === null || !validMeasurement('kg', kg) || !validMeasurement('reps', reps) ||
        !validMeasurement('rir', rir)) {
      setMessage('invalid');
      return;
    }
    const intent = JSON.stringify([exercise, kg, reps, rir]);
    const day = pendingAdd.current?.intent === intent ? pendingAdd.current.day : localDate(new Date());
    pendingAdd.current = { day, intent };
    void write(JSON.stringify(['add', day, intent]), id => addSet(id, day, exercise, { kg, reps, rir }));
  }

  function save(base: JournalSet) {
    if (!editor) return;
    const { field, value } = editor;
    if (field === 'status') {
      const status = statuses.find(item => item === value);
      if (status) {
        const key = JSON.stringify(['status', base.id, base.revisions, status]);
        void write(key, id => setStatus(id, base, status));
      }
      return;
    }
    if (editor.conflict && base.status !== 'completed') {
      const key = JSON.stringify(['restore', base.id, base.revisions]);
      void write(key, async id => {
        await setStatus(id, base, 'completed');
        const latest = (await listSets()).find(row => row.id === base.id);
        if (latest) setEditor({ base: latest, field, value, conflict: latest });
      }, true);
      return;
    }
    const number = parseDecimal(value);
    if (!validMeasurement(field, number)) {
      setMessage('invalid');
      return;
    }
    const key = JSON.stringify(['edit', base.id, field, base.revisions[field], number]);
    void write(key, id => editSet(id, base, { [field]: number }));
  }

  function displayField(field: Field, value: string | number | null) {
    if (field === 'status') return text[value as SetStatus];
    const numeric = typeof value === 'string' ? parseDecimal(value) : value;
    if (numeric === null) return field === 'kg' ? text.unknownLoad : text.rirUnknown;
    return numberFormat.format(numeric);
  }

  const grouped = new Map<string, Map<Exercise, JournalSet[]>>();
  for (const row of sets ?? []) {
    const day = grouped.get(row.day) ?? new Map<Exercise, JournalSet[]>();
    const group = day.get(row.exercise) ?? [];
    group.push(row);
    day.set(row.exercise, group);
    grouped.set(row.day, day);
  }
  const numberFormat = new Intl.NumberFormat(locale, { maximumFractionDigits: 12 });
  const dayFormat = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });

  return (
    <section className="session-demo local-journal" aria-labelledby="local-journal-heading">
      <h2 id="local-journal-heading" tabIndex={-1}>{text.heading}</h2>
      <p>{text.intro}</p>
      {!editor && <form className="journal-entry" aria-label={text.newSet} onSubmit={event => {
        event.preventDefault();
        add();
      }}>
        <label>{text.exercise}
          <select value={exercise} disabled={busy} onChange={event => {
            if (event.target.value === 'bench' || event.target.value === 'machine') {
              pendingAdd.current = null;
              setExercise(event.target.value);
              setMessage(null);
            }
          }}>
            {sampleExerciseIds.map(item => <option key={item} value={item}>{text[item]}</option>)}
          </select>
        </label>
        <div className="journal-inputs">
          {measures.map(field => <label key={field}>{text[field]}
            <input type="text" inputMode={field === 'kg' ? 'decimal' : 'numeric'} disabled={busy}
              value={draft[field]} required={field === 'reps'}
              aria-invalid={message === 'invalid' && !validMeasurement(field, parseDecimal(draft[field]))}
              aria-describedby={message === 'invalid' ? 'journal-message' : undefined} onChange={event => {
                const value = event.target.value;
                setDrafts(previous => ({ ...previous, [exercise]: { ...previous[exercise], [field]: value } }));
                setMessage(null);
              }} />
          </label>)}
        </div>
        <p>{text.optional}</p>
        <button type="submit" disabled={busy || sets === null || readFailure !== null}>{text.add}</button>
      </form>}
      {readFailure && <div role="alert"><p>{text[readFailure]}</p>
        <button type="button" onClick={() => void refresh()}>{text.retryRead}</button></div>}
      {message && <p id="journal-message" role={message === 'saved' ? 'status' : 'alert'}>{text[message]}</p>}
      {sets && sets.length > 0 && <JournalChart rows={sets} locale={locale} />}
      <h3 className="demo-history">{text.history}</h3>
      {sets === null && !readFailure && <p role="status">{text.loading}</p>}
      {sets?.length === 0 && <p>{text.empty}</p>}
      {[...grouped.keys()].sort().reverse().map(day => (
        <section key={day}>
          <h4><time dateTime={day}>{dayFormat.format(new Date(day + 'T12:00:00'))}</time></h4>
          {[...grouped.get(day)!].map(([item, group]) => (
            <div key={item}>
              <h5>{text[item]}</h5>
              <ol>{group.map(row => (
                <li key={row.id}>
                  {row.status === 'completed' ? (
                    <>{row.kg === null ? text.unknownLoad : numberFormat.format(row.kg) + ' ' + text.kgUnit} × {row.reps} · {row.rir === null ? text.rirUnknown : `${text.rirUnit} ${row.rir}`}</>
                  ) : text[row.status]}
                  {' '}<button className="demo-secondary" type="button" disabled={busy || editor !== null}
                    onClick={event => {
                      returnFocus.current = event.currentTarget;
                      setEditor(startEdit(row, row.status === 'completed' ? 'reps' : 'status', locale));
                      setMessage(null);
                    }}>{text.edit}</button>
                  {editor?.base.id === row.id && <fieldset disabled={busy}>
                    <legend>{text.correct}</legend>
                    <label>{text.field}
                      <select autoFocus value={editor.field} disabled={!!editor.conflict} onChange={event => {
                        const field = fields.find(item => item === event.target.value);
                        if (field) { setEditor(startEdit(editor.base, field, locale)); setMessage(null); }
                      }}>
                        {fields.filter(field => editor.base.status === 'completed' || field === 'status').map(field => <option key={field} value={field}>{text[field]}</option>)}
                      </select>
                    </label>
                    <label>{text[editor.field]}
                      {editor.field === 'status' ? (
                        <select value={editor.value} disabled={!!editor.conflict} onChange={event => {
                          setEditor({ ...editor, value: event.target.value }); setMessage(null);
                        }}>
                          {statuses.map(status => <option key={status} value={status}>{text[status]}</option>)}
                        </select>
                      ) : <input type="text" aria-invalid={message === 'invalid'} aria-describedby={message === 'invalid' ? 'journal-message' : undefined} inputMode={editor.field === 'kg' ? 'decimal' : 'numeric'}
                        value={editor.value} disabled={!!editor.conflict} onChange={event => {
                          setEditor({ ...editor, value: event.target.value }); setMessage(null);
                        }} />}
                    </label>
                    {editor.field === 'rir' && <p>{text.rirHint}</p>}
                    {editor.conflict && <div role="alert">
                      <p>{text.conflict}</p>
                      {editor.field !== 'status' && editor.conflict.status !== 'completed' &&
                        <p>{text[editor.conflict.status]} · {text.statusConflict}</p>}
                      {editor.field === 'status' && <p>
                        {editor.conflict.kg === null ? text.unknownLoad : numberFormat.format(editor.conflict.kg) + ' ' + text.kgUnit} × {editor.conflict.reps} · {text.rirUnit} {displayField('rir', editor.conflict.rir)}
                      </p>}
                      <p>{text.stored} · {displayField(editor.field, editor.conflict[editor.field])}</p>
                      <p>{text.mine} · {displayField(editor.field, editor.value)}</p>
                    </div>}
                    <div className="demo-actions">
                      <button type="button" onClick={() => save(editor.conflict ?? editor.base)}>
                        {editor.conflict && editor.field !== 'status' && editor.conflict.status !== 'completed' ? text.reviewRestore : editor.conflict ? text.apply : text.save}
                      </button>
                      <button type="button" className="demo-secondary" onClick={() => {
                        setEditor(null); setMessage(null); void refresh();
                      }}>{editor.conflict ? text.keep : text.cancel}</button>
                    </div>
                  </fieldset>}
                </li>
              ))}</ol>
            </div>
          ))}
        </section>
      ))}
    </section>
  );
}
