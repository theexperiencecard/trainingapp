import type { Locale } from '../locales/messages';
import { journalText } from '../locales/journal';
import { weekText } from '../locales/sessions';
import type { LocalJournalState } from './journalUpdates';
import { WalkingWeekProgress } from './WalkingWeekProgress';
import { weekPreview } from './matchExampleWeek';
import type { SessionChoice } from './guidedWeeks';

type Props = {
  answers: Record<string, string[]>;
  locale: Locale;
  journal: LocalJournalState;
  sessionOpen: boolean;
  onStart: (day: SessionChoice) => void;
};

export function WeekPreview({ answers, locale, sessionOpen, onStart, journal }: Props) {
  const text: Record<string, string> = weekText[locale];
  const { week, reasons } = weekPreview(answers);
  return (
    <section aria-label={text.heading}>
      <h4>{text.heading}</h4>
      {week ? (
        <>
          <p>{text[week.description]}</p>
          <details>
            <summary>{text.open}</summary>
            <p>{text[week.setup]}</p>
            {week.walkMinutesPerDay > 0 && <WalkingWeekProgress locale={locale} journal={journal}
              plannedMinutes={week.walkMinutesPerDay * week.days.length} />}
            {week.days.map((day, index) => (
              <section key={index}>
                <h5>{text[index === 0 ? 'dayA' : 'dayB']} · {day.minutes.toLocaleString(locale)} min</h5>
                <ol>{day.movements.map(move => <li key={move}>{text[move]}</li>)}</ol>
                {week.walkMinutesPerDay > 0 && <p>{weekText[locale].walk.replace('{minutes}', String(week.walkMinutesPerDay))} <a href="#walk-entry-heading">{journalText[locale].walkLink}</a></p>}
                {sessionOpen ? <p><a href="#week-example-heading">{text.resumeSession}</a></p> :
                    <button type="button" onClick={() => onStart({ week: week.description, day: index === 0 ? 0 : 1 })}>{text.startSession}</button>}
              </section>
            ))}
          </details>
        </>
      ) : (
        <>
          <p>{text.uncovered}</p>
          <ul>{reasons.map(reason => <li key={reason}>{text[reason]}</li>)}</ul>
        </>
      )}
      <p>{text.review}</p>
    </section>
  );
}
