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
  allowMachine: boolean;
  locale: Locale;
  journal: LocalJournalState;
  onClose: () => void;
};

export function StrengthExampleSession({ day, allowMachine, locale, journal, onClose }: Props) {
  const text = weekText[locale];
  const demo = demoText[locale];
  const session = strengthExample[day];
  const steps = session.blocks.flatMap(({ exercise, repetitions }) =>
    repetitions.map(reps => ({ exercise, reps })),
  );
  const [date] = useState(() => localDate(new Date()));
  const [count, setCount] = useState(0);
  const { save, saving, failed } = useGuidedSetRecorder(journal);
  const [machineAvailable] = useState(allowMachine);
  const [useMachine, setUseMachine] = useState(false);
  const current = steps[count];
  const canSwitch = machineAvailable && count === 1 && current?.exercise === 'bench';
  const exercise = canSwitch && useMachine ? 'machine' : current?.exercise;
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    heading.current?.focus();
  }, [count]);

  return (
    <section className="session-demo" aria-labelledby="strength-example-heading">
      <h2 id="strength-example-heading" tabIndex={-1} ref={heading}>
        {current ? text[day === 0 ? 'dayA' : 'dayB'] : text.sessionComplete}
      </h2>
      {current && exercise ? (
        <>
          <p>{text.guidedNotice} · {session.minutes.toLocaleString(locale)} min</p>
          <p>{text.setProgress.replace('{current}', String(count + 1)).replace('{total}', String(steps.length))}</p>
          {count > 0 && <p><a href="#workout-timer-heading">{demo.openTimer}</a></p>}
          {canSwitch && (
            <div>
              <label>{demo.choice}
                <select disabled={saving || failed} value={useMachine ? 'machine' : 'bench'}
                  onChange={event => setUseMachine(event.target.value === 'machine')}>
                  <option value="bench">{demo.keepBench}</option>
                  <option value="machine">{demo.today}</option>
                </select>
              </label>
              {useMachine && <p>{demo.machineTradeoff}</p>}
            </div>
          )}
          <GuidedSetForm key={count} locale={locale} exercise={exercise} exampleReps={current.reps}
            reference={journal.sets && !journal.readFailure ? lastRecordedSet(journal.sets, exercise, date) : null}
            referenceStatus={journal.readFailure ?? (journal.sets === null ? 'loading' : 'ready')}
            saving={saving} failed={failed} submitLabel={failed ? demo.retry : journalText[locale].add}
            onRecord={values => save(date, exercise, values, () => setCount(count + 1))} />
          {failed && <p role="alert">{demo.saveError}</p>}
        </>
      ) : <p><a href="#local-journal-heading">{demo.openJournal}</a></p>}
      <button className="demo-secondary" type="button" disabled={saving} onClick={onClose}>{text.closeSession}</button>
    </section>
  );
}
