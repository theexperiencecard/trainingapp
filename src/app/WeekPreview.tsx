import type { Locale } from '../locales/messages';
import { journalText } from '../locales/journal';
import { weekText } from '../locales/sessions';
import { weekPreview } from './matchExampleWeek';
import type { SessionChoice } from './guidedWeeks';

type Props = {
  answers: Record<string, string[]>;
  locale: Locale;
  sessionOpen: boolean;
  onStart: (day: SessionChoice) => void;
};

export function WeekPreview({ answers, locale, sessionOpen, onStart }: Props) {
  const text: Record<string, string> = weekText[locale];
  const { week, reasons } = weekPreview(answers);
  const family = week?.description;
  return (
    <section aria-label={text.heading}>
      <h4>{text.heading}</h4>
      {week ? (
        <>
          <p>{text[week.description]}</p>
          <details>
            <summary>{text.open}</summary>
            <p>{text[week.setup]}</p>
            {week.days.map((day, index) => (
              <section key={index}>
                <h5>{text[index === 0 ? 'dayA' : 'dayB']} · {day.minutes.toLocaleString(locale)} min</h5>
                <ol>{day.movements.map(move => <li key={move}>{text[move]}</li>)}</ol>
                {week.walk && <p>{text.walk} <a href="#walk-entry-heading">{journalText[locale].walkLink}</a></p>}
                {(family === 'strengthWeek' || family === 'muscleWeek') && (
                  sessionOpen ? <p><a href="#week-example-heading">{text.resumeSession}</a></p> :
                    <button type="button" onClick={() => onStart({ week: family, day: index === 0 ? 0 : 1 })}>{text.startSession}</button>
                )}
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
