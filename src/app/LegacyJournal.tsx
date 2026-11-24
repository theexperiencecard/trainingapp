import { useEffect, useState } from 'react';
import type { Locale } from '../locales/messages';
import { hasLegacyJournal, readLegacyJournal, type LegacySet } from '../storage/legacyJournal';
import it from '../locales/legacy-it.json';
import de from '../locales/legacy-de.json';
import en from '../locales/legacy-en.json';

const translations = { it, de, en } satisfies Record<Locale, typeof it>;

export function LegacyJournal({ locale }: { locale: Locale }) {
  const text = translations[locale];
  const [available, setAvailable] = useState(false);
  const [rows, setRows] = useState<LegacySet[]>([]);
  const [state, setState] = useState<'closed' | 'reading' | 'ready' | 'error'>('closed');

  useEffect(() => {
    let active = true;
    void hasLegacyJournal().then(found => { if (active) setAvailable(found); })
      .catch(() => { /* Storage access can be disabled for the entire origin. */ });
    return () => { active = false; };
  }, []);

  async function showHistory() {
    setState('reading');
    try {
      setRows(await readLegacyJournal());
      setState('ready');
    } catch {
      setState('error');
    }
  }

  if (!available) return null;
  const format = new Intl.NumberFormat(locale);
  return (
    <section className="session-demo" aria-labelledby="legacy-heading">
      <h2 id="legacy-heading">{text.heading}</h2>
      <p>{text.intro}</p>
      <button type="button" disabled={state === 'reading'} onClick={() => void showHistory()}>
        {state === 'ready' ? text.refresh : text.show}
      </button>
      {state === 'reading' && <p role="status">{text.loading}</p>}
      {state === 'error' && <p role="alert">{text.error}</p>}
      {state === 'ready' && (rows.length === 0 ? <p>{text.empty}</p> : <ol>
        {rows.map(row => <li key={row.id}>
          <time dateTime={row.day}>{row.day}</time> · {text[row.exercise]} · {row.kg === null ? text.missing : format.format(row.kg) + ' kg'} × {row.reps}
          {' · '}{text.rir} {row.rir ?? text.missing}{row.deleted && <> · {text.voided}</>}
        </li>)}
      </ol>)}
    </section>
  );
}
