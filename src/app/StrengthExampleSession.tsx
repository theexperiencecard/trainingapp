import { useEffect, useRef, useState } from 'react';
import { localDate } from '../core/journalInput';
import { lastRecordedSet } from '../core/lastRecordedSet';
import { journalText } from '../locales/journal';
import type { Locale } from '../locales/messages';
import { weekText, demoText } from '../locales/sessions';
import { GuidedSetForm } from './GuidedSetForm';
import type { LocalJournalState } from './journalUpdates';
import { strengthExample, type StrengthDayIndex } from './strengthExample';
import { useGuidedSetRecorder } from './useGuidedSetRecorder';

type Props = {
  day: StrengthDayIndex;
  locale: Locale;
  journal: LocalJournalState;
  onClose: () => void;
};

export function StrengthExampleSession({ day, locale, journal, onClose }: Props) {
  const text = weekText[locale];
  const demo = demoText[locale];
  const session = strengthExample[day];
  const steps = session.blocks.flatMap(({ exercise, repetitions }) =>
    repetitions.map(reps => ({ exercise, reps })),
  );
  const [date] = useState(() => localDate(new Date()));
  const [count, setCount] = useState(0);
  const { save, saving, failed } = useGuidedSetRecorder(journal);
  const current = steps[count];
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    heading.current?.focus();
  }, [count]);

  return (
    <section className="session-demo" aria-labelledby="strength-example-heading">
      <h2 id="strength-example-heading" tabIndex={-1} ref={heading}>
        {current ? text[day === 0 ? 'dayA' : 'dayB'] : text.sessionComplete}
      </h2>
      {current ? (
        <>
          <p>{text.guidedNotice} · {session.minutes.toLocaleString(locale)} min</p>
          <p>{text.setProgress.replace('{current}', String(count + 1)).replace('{total}', String(steps.length))}</p>
          {count > 0 && <p><a href="#workout-timer-heading">{demo.openTimer}</a></p>}
          <GuidedSetForm key={count} locale={locale} exercise={current.exercise} exampleReps={current.reps}
            reference={journal.sets && !journal.readFailure ? lastRecordedSet(journal.sets, current.exercise, date) : null}
            referenceStatus={journal.readFailure ?? (journal.sets === null ? 'loading' : 'ready')}
            saving={saving} failed={failed} submitLabel={failed ? demo.retry : journalText[locale].add}
            onRecord={values => save(date, current.exercise, values, () => setCount(count + 1))} />
          {failed && <p role="alert">{demo.saveError}</p>}
        </>
      ) : <p><a href="#local-journal-heading">{demo.openJournal}</a></p>}
      <button className="demo-secondary" type="button" disabled={saving} onClick={onClose}>{text.closeSession}</button>
    </section>
  );
}
