import type { Locale } from '../locales/messages';
import it from '../locales/week-it.json';
import de from '../locales/week-de.json';
import en from '../locales/week-en.json';
import { weekPreview } from './matchExampleWeek';

const translations = { it, de, en } satisfies Record<Locale, typeof it>;

export function WeekPreview({ answers, locale }: { answers: Record<string, string[]>; locale: Locale }) {
  const text: Record<string, string> = translations[locale];
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
            {week.days.map((day, index) => (
              <section key={index}>
                <h5>{text[index === 0 ? 'dayA' : 'dayB']} · {day.minutes.toLocaleString(locale)} min</h5>
                <ol>{day.movements.map(move => <li key={move}>{text[move]}</li>)}</ol>
                {week.walk && <p>{text.walk}</p>}
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
