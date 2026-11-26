import { useState } from 'react';
import { sampleExerciseIds, usesExternalLoad } from '../core/sampleExercises';
import { dailyVolumes } from '../core/journalVolume';
import type { JournalSet, Exercise } from '../storage/localJournal';
import { journalText } from '../locales/journal';
import type { Locale } from '../locales/messages';
import it from '../locales/chart-it.json';
import de from '../locales/chart-de.json';
import en from '../locales/chart-en.json';

const translations = { it, de, en } satisfies Record<Locale, typeof it>;

export function JournalChart({ rows, locale }: { rows: JournalSet[]; locale: Locale }) {
  const [selected, select] = useState<Exercise | null>(null);
  const available = sampleExerciseIds.filter((exercise) => usesExternalLoad(exercise) && rows.some((row) => row.exercise === exercise && row.status === 'completed'));
  const exercise = selected && available.includes(selected) ? selected : available[0];
  if (!exercise) return null;

  const text = translations[locale];
  const days = dailyVolumes(rows, exercise).slice(-7);
  const peak = Math.max(...days.map((entry) => entry.kg ?? 0));
  const date = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  const number = new Intl.NumberFormat(locale);
  return (
    <section className="journal-chart">
      <h3>{text.title}</h3>
      <label>{text.exercise}
        <select value={exercise} onChange={(event) => {
          const match = available.find((item) => item === event.target.value);
          if (match) select(match);
        }}>
          {available.map((item) => <option key={item} value={item}>{item === 'bench' || item === 'machine' ? text[item] : journalText[locale][item]}</option>)}
        </select>
      </label>
      <p>{text.description}</p>
      <ul>
        {days.map((entry) => (
          <li key={entry.day}>
            <time dateTime={entry.day}>{date.format(new Date(entry.day + 'T00:00:00Z'))}</time>
            <span>{entry.kg === null ? text.unknown : number.format(entry.kg) + ' ' + text.unit} · {entry.sets} {entry.sets === 1 ? text.single : text.plural}</span>
            {entry.kg !== null && (
              <div aria-hidden="true" className="chart-track">
                <i style={{ width: (peak ? entry.kg / peak * 100 : 0) + '%' }} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
