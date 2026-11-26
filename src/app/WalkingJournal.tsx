import { useRef, useState } from 'react';
import { localDate, newOperationId, parseDecimal } from '../core/journalInput';
import { weekText } from '../locales/sessions';
import { journalText } from '../locales/journal';
import type { Locale } from '../locales/messages';
import { addWalk, type JournalWalk, type WalkIntensity } from '../storage/localJournal';

const intensityLabels = {
  light: 'walkLight', moderate: 'walkModerate', vigorous: 'walkVigorous', unknown: 'walkUnknown',
} as const satisfies Record<WalkIntensity, string>;
const intensities = ['light', 'moderate', 'vigorous', 'unknown'] as const;

type EntryProps = { locale: Locale; disabled: boolean; onSaved: (day: string) => Promise<void> };

export function WalkingEntry({ locale, disabled, onSaved }: EntryProps) {
  const text = journalText[locale];
  const [day, setDay] = useState(() => localDate(new Date()));
  const [minutes, setMinutes] = useState('');
  const [intensity, setIntensity] = useState<WalkIntensity | ''>('');
  const [message, setMessage] = useState<'saved' | 'invalid' | 'failed' | null>(null);
  const [busy, setBusy] = useState(false);
  const writing = useRef(false);
  const pending = useRef<string | null>(null);

  async function save() {
    if (disabled || writing.current) return;
    const value = parseDecimal(minutes);
    const seconds = Math.round((value ?? 0) * 60);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !intensity || value === null ||
        !Number.isSafeInteger(seconds) || value * 60 < 1 || value > 1440) {
      setMessage('invalid');
      return;
    }
    writing.current = true;
    setBusy(true);
    try {
      pending.current ??= newOperationId();
      await addWalk(pending.current, day, seconds, intensity);
      await onSaved(day);
      pending.current = null;
      setMinutes('');
      setIntensity('');
      setMessage('saved');
    } catch {
      setMessage('failed');
    } finally {
      writing.current = false;
      setBusy(false);
    }
  }

  const locked = disabled || busy || message === 'failed';
  return (
    <form className="journal-entry" aria-labelledby="walk-entry-heading" onSubmit={event => {
      event.preventDefault();
      void save();
    }}>
      <h3 id="walk-entry-heading" tabIndex={-1}>{text.walkEntry}</h3>
      <div className="journal-inputs">
        <label>{text.walkDay}
          <input type="date" value={day} required disabled={locked}
            onChange={event => { setDay(event.target.value); setMessage(null); }} />
        </label>
        <label>{text.walkMinutes}
          <input type="text" inputMode="decimal" value={minutes} required disabled={locked}
            onChange={event => { setMinutes(event.target.value); setMessage(null); }} />
        </label>
        <label>{text.walkIntensity}
          <select value={intensity} required disabled={locked} onChange={event => {
            setIntensity(intensities.find(item => item === event.target.value) ?? '');
            setMessage(null);
          }}>
            <option value="" disabled>{text.walkChoose}</option>
            {intensities.map(item => <option key={item} value={item}>{text[intensityLabels[item]]}</option>)}
          </select>
        </label>
      </div>
      <button type="submit" disabled={disabled || busy}>{message === 'failed' ? text.walkRetry : text.walkSave}</button>
      {message && <p role={message === 'saved' ? 'status' : 'alert'}>
        {message === 'invalid' ? text.walkInvalid : message === 'failed' ? text.writeError : text.walkSaved}
      </p>}
    </form>
  );
}

function duration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return remainder ? `${minutes} min ${remainder} s` : `${minutes} min`;
}

export function WalkingTotals({ walks, locale, plannedMinutes }: {
  walks: JournalWalk[]; locale: Locale; plannedMinutes?: number;
}) {
  const text = journalText[locale];
  const totals: Record<WalkIntensity, number> = { light: 0, moderate: 0, vigorous: 0, unknown: 0 };
  let total = 0;
  for (const walk of walks) {
    totals[walk.intensity] += walk.seconds;
    total += walk.seconds;
  }
  return <>
    {plannedMinutes !== undefined && <p>{weekText[locale].walkCompared
      .replace('{recorded}', duration(total)).replace('{planned}', plannedMinutes.toLocaleString(locale))}</p>}
    <dl>
      {plannedMinutes === undefined && <div><dt>{text.walkTotal}</dt><dd>{duration(total)}</dd></div>}
      {intensities.filter(item => totals[item] > 0).map(item => <div key={item}>
        <dt>{text[intensityLabels[item]]}</dt><dd>{duration(totals[item])}</dd>
      </div>)}
    </dl>
  </>;
}

export function WalkingHistory({ walks, locale }: { walks: JournalWalk[]; locale: Locale }) {
  const text = journalText[locale];
  if (!walks.length) return null;
  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' });
  return (
    <section aria-label={text.walkHistory}>
      <h3>{text.walkHistory}</h3>
      <WalkingTotals walks={walks} locale={locale} />
      <ul>{walks.map(walk => <li key={walk.id}>
        <time dateTime={walk.day}>{date.format(new Date(walk.day + 'T00:00:00Z'))}</time>
        {' · '}{duration(walk.seconds)} · {text[intensityLabels[walk.intensity]]}
      </li>)}</ul>
    </section>
  );
}
