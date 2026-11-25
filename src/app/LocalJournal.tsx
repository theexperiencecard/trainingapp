import { useEffect, useMemo, useRef, useState } from 'react';
import type { Locale } from '../locales/messages';
import { exampleDraft, localDate, newOperationId, parseDecimal, readSetDraft, validMeasurement } from '../core/journalInput';
import type { LocalJournalState } from './journalUpdates';
import { exampleDrafts, sampleExerciseIds } from '../core/sampleExercises';
import { WalkingEntry, WalkingHistory } from './WalkingJournal';
import { JournalChart } from './JournalChart';
import './localJournal.css';
import { SetMeasurements } from './SetMeasurements';
import { mondayOfWeek } from '../core/journalWeek';
import { journalText } from '../locales/journal';
import {
  addSet, editSet, JournalConflict, listSets, setStatus, type Exercise, type JournalSet, type SetStatus,
} from '../storage/localJournal';

const statuses: readonly SetStatus[] = ['completed', 'skipped', 'voided'];
const fields = ['reps', 'kg', 'rir', 'status'] as const;
type Field = typeof fields[number];
type Editor = { base: JournalSet; field: Field; value: string; conflict?: JournalSet };

const initialDrafts = exampleDrafts(exampleDraft);

function startEdit(base: JournalSet, field: Field, locale: Locale): Editor {
  const value = base[field];
  const draft = typeof value === 'number'
    ? value.toLocaleString(locale, { useGrouping: false, maximumFractionDigits: 20 })
    : value ?? '';
  return { base, field, value: draft };
}

export function LocalJournal({ locale, journal }: { locale: Locale; journal: LocalJournalState }) {
  const { sets, walks, readFailure, refresh, announceWrite } = journal;
  const text = journalText[locale];
  const [selectedWeek, setSelectedWeek] = useState('');
  const [exercise, setExercise] = useState<Exercise>('bench');
  const [drafts, setDrafts] = useState(initialDrafts);
  const draft = drafts[exercise];
  const [message, setMessage] = useState<'saved' | 'writeError' | 'invalid' | null>(null);
  const [busy, setBusy] = useState(false);
  const [editor, setEditor] = useState<Editor | null>(null);
  const writing = useRef(false);
  const operation = useRef<{ key: string; id: string } | null>(null);
  const pendingAdd = useRef<{ day: string; intent: string } | null>(null);
  const returnFocus = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!editor && !busy && returnFocus.current) {
      returnFocus.current.focus();
      returnFocus.current = null;
    }
  }, [editor, busy]);

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
    await announceWrite();
    writing.current = false;
    setBusy(false);
  }

  function add() {
    const values = readSetDraft(draft);
    if (!values) {
      setMessage('invalid');
      return;
    }
    const intent = JSON.stringify([exercise, values]);
    const day = pendingAdd.current?.intent === intent ? pendingAdd.current.day : localDate(new Date());
    pendingAdd.current = { day, intent };
    void write(JSON.stringify(['add', day, intent]), async id => {
      await addSet(id, day, exercise, values);
      setSelectedWeek(week => week ? mondayOfWeek(day) : '');
    });
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
  const weeks = useMemo(() => {
    const mondays = new Set<string>();
    for (const row of sets ?? []) mondays.add(mondayOfWeek(row.day));
    for (const walk of walks ?? []) mondays.add(mondayOfWeek(walk.day));
    return [...mondays].sort().reverse();
  }, [sets, walks]);
  const visibleRows = (sets ?? []).filter(row => !selectedWeek || mondayOfWeek(row.day) === selectedWeek);
  const visibleWalks = (walks ?? []).filter(row => !selectedWeek || mondayOfWeek(row.day) === selectedWeek);
  for (const row of visibleRows) {
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
            const next = sampleExerciseIds.find(item => item === event.target.value);
            if (next) {
              pendingAdd.current = null;
              setExercise(next);
              setMessage(null);
            }
          }}>
            {sampleExerciseIds.map(item => <option key={item} value={item}>{text[item]}</option>)}
          </select>
        </label>
        <SetMeasurements locale={locale} draft={draft} disabled={busy}
          errorId={message === 'invalid' ? 'journal-message' : undefined} onChange={next => {
            setDrafts(previous => ({ ...previous, [exercise]: next }));
            setMessage(null);
          }} />
        <button type="submit" disabled={busy || sets === null || readFailure !== null}>{text.add}</button>
      </form>}
      <WalkingEntry locale={locale} disabled={busy || editor !== null || walks === null || readFailure !== null}
        onSaved={async day => {
          setSelectedWeek(week => week ? mondayOfWeek(day) : '');
          await announceWrite();
        }} />
      {readFailure && <div role="alert"><p>{text[readFailure]}</p>
        <button type="button" onClick={() => void refresh()}>{text.retryRead}</button></div>}
      {message && <p id="journal-message" role={message === 'saved' ? 'status' : 'alert'}>{text[message]}</p>}
      {weeks.length > 1 && <label>{text.week}
        <select disabled={busy || editor !== null} value={selectedWeek} onChange={event => setSelectedWeek(event.target.value)}>
          <option value="">{text.allWeeks}</option>
          {weeks.map(monday => <option key={monday} value={monday}>
            {text.fromMonday.replace('{date}', dayFormat.format(new Date(monday + 'T12:00:00')))}
          </option>)}
        </select>
      </label>}
      <WalkingHistory walks={visibleWalks} locale={locale} />
      {visibleRows.length > 0 && <JournalChart rows={visibleRows} locale={locale} />}
      <h3 className="demo-history">{text.history}</h3>
      {sets === null && !readFailure && <p role="status">{text.loading}</p>}
      {sets?.length === 0 && walks?.length === 0 && <p>{text.empty}</p>}
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
