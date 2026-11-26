import { useId } from 'react';
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
  activeSession: SessionChoice | null;
  onStart: (day: SessionChoice) => void;
};

export function WeekPreview({ answers, locale, activeSession, onStart, journal }: Props) {
  const text = weekText[locale];
  const reasonsText: Record<string, string> = text;
  const { week, reasons } = weekPreview(answers);
  const headingId = useId();
  const openInPreview = activeSession !== null && activeSession.week === week?.description;
  const resumeLink = <a href="#week-example-heading">{text.resumeSession}</a>;

  function plannedSets(count: number) {
    return text[count === 1 ? 'plannedSet' : 'plannedSets'].replace('{count}', count.toLocaleString(locale));
  }

  return (
    <section aria-label={text.heading}>
      <h4>{text.heading}</h4>
      {activeSession && !openInPreview && <p>{resumeLink}</p>}
      {week ? (
        <>
          <p>{text[week.description]}</p>
          <details>
            <summary>{text.open}</summary>
            <p>{text[week.setup]}</p>
            {week.walkMinutesPerDay > 0 && <WalkingWeekProgress locale={locale} journal={journal}
              plannedMinutes={week.walkMinutesPerDay * week.days.length} />}
            {activeSession && <p>{text.finishOpenSession}</p>}
            {week.days.map((day, index) => {
              const dayIndex = index === 0 ? 0 : 1;
              const id = headingId + '-' + dayIndex;
              const total = day.blocks.reduce((sum, block) => sum + block.repetitions.length, 0);
              return (
                <section key={id} aria-labelledby={id}>
                  <h5 id={id}>{text[dayIndex === 0 ? 'dayA' : 'dayB']} · {day.minutes.toLocaleString(locale)} min</h5>
                  <p>{plannedSets(total)}</p>
                  <ol>{day.blocks.map(block => <li key={block.exercise}>
                    <span>{text[block.exercise]}</span> · {plannedSets(block.repetitions.length)}
                  </li>)}</ol>
                  {week.walkMinutesPerDay > 0 && <p>{text.walk.replace('{minutes}', String(week.walkMinutesPerDay))} <a href="#walk-entry-heading">{journalText[locale].walkLink}</a></p>}
                  {openInPreview && activeSession.day === dayIndex && <p>{resumeLink}</p>}
                  {!activeSession && <button type="button" onClick={() => onStart({ week: week.description, day: dayIndex })}>
                    {text.startSession}
                  </button>}
                </section>
              );
            })}
          </details>
        </>
      ) : (
        <>
          <p>{text.uncovered}</p>
          <ul>{reasons.map(reason => <li key={reason}>{reasonsText[reason]}</li>)}</ul>
        </>
      )}
      <p>{text.review}</p>
    </section>
  );
}
