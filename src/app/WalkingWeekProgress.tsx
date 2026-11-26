import { useState } from 'react';
import { localDate } from '../core/journalInput';
import { mondayOfWeek } from '../core/journalWeek';
import { journalText } from '../locales/journal';
import type { Locale } from '../locales/messages';
import { weekText } from '../locales/sessions';
import type { LocalJournalState } from './journalUpdates';

import { WalkingTotals } from './WalkingJournal';

type Props = { locale: Locale; journal: LocalJournalState; plannedMinutes: number };

export function WalkingWeekProgress({ locale, journal, plannedMinutes }: Props) {
  const [selection, setSelection] = useState('');
  const text = weekText[locale];
  const currentWeek = mondayOfWeek(localDate(new Date()));
  const monday = selection || currentWeek;
  if (journal.readFailure || !journal.walks) return <p>{journalText[locale][journal.readFailure ?? 'loading']}</p>;

  const weeks = new Set([currentWeek]);
  for (const row of journal.sets ?? []) weeks.add(mondayOfWeek(row.day));
  for (const walk of journal.walks) weeks.add(mondayOfWeek(walk.day));
  const walks = journal.walks.filter(walk => mondayOfWeek(walk.day) === monday);
  const format = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' });
  return (
    <section aria-label={text.walkComparison}>
      <label>{text.walkComparison}
        <select value={monday} onChange={event => setSelection(event.target.value)}>
          {[...weeks].sort().reverse().map(date => <option value={date} key={date}>
            {journalText[locale].fromMonday.replace('{date}', format.format(new Date(date + 'T00:00:00Z')))}
          </option>)}
        </select>
      </label>
      <WalkingTotals locale={locale} walks={walks} plannedMinutes={plannedMinutes} />
    </section>
  );
}
