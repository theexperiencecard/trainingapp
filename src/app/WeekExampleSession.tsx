import { useEffect, useRef, useState } from 'react';
import { localDate } from '../core/journalInput';
import { dailyExerciseTotals } from '../core/journalVolume';
import { sampleExerciseIds, usesExternalLoad } from '../core/sampleExercises';
import { lastRecordedSet } from '../core/lastRecordedSet';
import { journalText } from '../locales/journal';
import type { Locale } from '../locales/messages';
import { weekText, demoText } from '../locales/sessions';
import { WorkoutTimer } from './WorkoutTimer';
import { GuidedSetForm } from './GuidedSetForm';
import type { LocalJournalState } from './journalUpdates';
import { guidedWeeks, mixedWalkMinutes, type ExampleDay, type SessionChoice } from './guidedWeeks';
import { useGuidedSetRecorder } from './useGuidedSetRecorder';

type Props = {
  choice: SessionChoice;
  budgetMinutes: number;
  allowMachine: boolean;
  locale: Locale;
  journal: LocalJournalState;
  onClose: () => void;
};

export function WeekExampleSession({ choice, budgetMinutes, allowMachine, locale, journal, onClose }: Props) {
  const text = weekText[locale];
  const demo = demoText[locale];
  const { day, week } = choice;
  const mixed = week !== 'strengthWeek' && week !== 'muscleWeek';
  const session: ExampleDay = guidedWeeks[week][day];
  const [budget] = useState(budgetMinutes);
  const steps = session.blocks.flatMap(({ exercise, repetitions, exampleKg }) =>
    repetitions.map(reps => ({ exercise, reps, exampleKg })),
  );
  const [date] = useState(() => localDate(new Date()));
  const [recordedIds, setRecordedIds] = useState<string[]>([]);
  const count = recordedIds.length;
  const [endedEarly, setEndedEarly] = useState(false);
  const rows = (journal.sets ?? []).filter(row => recordedIds.includes(row.id));
  const { save, saving, failed } = useGuidedSetRecorder(journal);
  const [machineAvailable] = useState(allowMachine);
  const [useMachine, setUseMachine] = useState(false);
  const [omitLast, setOmitLast] = useState(false);
  const muscleChange = week === 'muscleWeek' && useMachine;
  const shortSession = muscleChange && omitLast;
  const total = steps.length - Number(shortSession);
  const minutes = session.minutes + (muscleChange ? 2 : 0) - (shortSession ? 2.25 : 0);
  const current = !endedEarly && count < total ? steps[count] : undefined;
  const canSwitch = machineAvailable && count === 1 && current?.exercise === 'bench';
  const exercise = canSwitch && useMachine ? 'machine' : current?.exercise;
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    heading.current?.focus();
  }, [count, endedEarly]);

  return (
    <section className="session-demo" aria-labelledby="week-example-heading">
      <h2 id="week-example-heading" tabIndex={-1} ref={heading}>
        {current ? text[day === 0 ? 'dayA' : 'dayB'] : (mixed ? text.musclePartComplete : text.sessionComplete)}
      </h2>
      {mixed && <p>{text.walk.replace('{minutes}', String(mixedWalkMinutes))} <a href="#walk-entry-heading">{journalText[locale].walkLink}</a></p>}
      {current && exercise ? (
        <>
          <p>{text.guidedNotice} · {minutes.toLocaleString(locale)} min</p>
          <p>{text.setProgress.replace('{current}', String(count + 1)).replace('{total}', String(total))}</p>
          {count > 0 && <WorkoutTimer locale={locale} inline />}
          {canSwitch && (
            <div>
              <label>{demo.choice}
                <select disabled={saving || failed} value={useMachine ? 'machine' : 'bench'}
                  onChange={event => setUseMachine(event.target.value === 'machine')}>
                  <option value="bench">{demo.keepBench}</option>
                  <option value="machine">{demo.today}</option>
                </select>
              </label>
              {useMachine && <p>{week === 'strengthWeek' ? demo.machineTradeoff : demo.machineMovement}</p>}
              {muscleChange && (
                <>
                  {minutes > budget && <p>{text.overBudget.replace('{minutes}', String(budget))}</p>}
                  <label><input type="checkbox" checked={omitLast} disabled={saving || failed}
                    onChange={event => setOmitLast(event.target.checked)} /> {text.omitCable}</label>
                </>
              )}
            </div>
          )}
          <GuidedSetForm key={count} locale={locale} exercise={exercise} exampleReps={current.reps} exampleKg={current.exampleKg}
            reference={journal.sets && !journal.readFailure ? lastRecordedSet(journal.sets, exercise, date) : null}
            referenceStatus={journal.readFailure ?? (journal.sets === null ? 'loading' : 'ready')}
            saving={saving} failed={failed} submitLabel={failed ? demo.retry : journalText[locale].add}
            onRecord={values => save(date, exercise, values, id => setRecordedIds(ids => [...ids, id]))} />
          {failed && <p role="alert">{demo.saveError}</p>}
        </>
      ) : <>
        {shortSession && !endedEarly && <p>{text.shortSummary}</p>}
        <p>{text.savedProgress.replace('{count}', String(count)).replace('{total}', String(steps.length))}</p>
        {journal.readFailure || rows.length !== count ? <p role="status">{journalText[locale][journal.readFailure ?? 'loading']}</p> :
          <dl aria-label={demo.volume}>{sampleExerciseIds.map(id => {
            const [volume] = dailyExerciseTotals(rows, id);
            if (!volume) return null;
            return <div key={id}>
              <dt>{journalText[locale][id]}</dt>
              <dd>{text.setCount.replace('{count}', String(volume.sets))}{usesExternalLoad(id) && ' · ' + (volume.kg === null
                ? demo.unknownVolume : volume.kg.toLocaleString(locale) + ' ' + demo.unit)}</dd>
            </div>;
          })}</dl>}
        {endedEarly && <button type="button" onClick={() => setEndedEarly(false)}>{text.resumeSession}</button>}
        <p><a href="#local-journal-heading">{demo.openJournal}</a></p>
      </>}
      <button className="demo-secondary" type="button" disabled={saving || failed} onClick={current && count ? () => setEndedEarly(true) : onClose}>
        {current && count ? text.endEarly : text.closeSession}</button>
    </section>
  );
}
