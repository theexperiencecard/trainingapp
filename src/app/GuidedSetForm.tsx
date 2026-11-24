import { useId, useState } from 'react';
import { exampleDraft, readSetDraft, type SetMeasurements as Values } from '../core/journalInput';
import { exampleDrafts, type Exercise } from '../core/sampleExercises';
import { journalText } from '../locales/journal';
import type { Locale } from '../locales/messages';
import type { JournalSet } from '../storage/localJournal';
import { SetMeasurements } from './SetMeasurements';

type Props = {
  locale: Locale;
  exercise: Exercise;
  exampleReps?: number;
  reference: JournalSet | null;
  referenceStatus: 'loading' | 'ready' | 'readError' | 'newerFormat';
  saving: boolean;
  failed: boolean;
  submitLabel: string;
  onRecord: (values: Values) => Promise<void>;
};

export function GuidedSetForm({ locale, exercise, exampleReps, reference, referenceStatus, saving, failed, submitLabel, onRecord }: Props) {
  const text = journalText[locale];
  const errorId = useId();
  const [drafts, setDrafts] = useState(() => {
    const defaults = exampleDrafts(exampleDraft);
    if (exampleReps !== undefined) defaults[exercise].reps = String(exampleReps);
    return defaults;
  });
  const [invalidExercise, setInvalidExercise] = useState<Exercise | null>(null);
  const invalid = invalidExercise === exercise;
  return (
    <form onSubmit={event => {
      event.preventDefault();
      const values = readSetDraft(drafts[exercise]);
      if (values) void onRecord(values);
      else setInvalidExercise(exercise);
    }}>
      <p><strong>{text[exercise]}</strong></p>
      {reference ? (
        <div>
          <p>
            {text.lastSet} · <time dateTime={reference.day}>{new Intl.DateTimeFormat(locale, {
              dateStyle: 'medium', timeZone: 'UTC',
            }).format(new Date(reference.day + 'T00:00:00Z'))}</time><br />
            {reference.kg === null ? text.unknownLoad : reference.kg.toLocaleString(locale) + ' ' + text.kgUnit}
            {' × '}{reference.reps} · {reference.rir === null ? text.rirUnknown : text.rirUnit + ' ' + reference.rir}
          </p>
          {reference.kg !== null && <button type="button" className="demo-secondary" disabled={saving || failed}
            onClick={() => {
              const kg = reference.kg?.toLocaleString(locale, { useGrouping: false, maximumSignificantDigits: 21 });
              if (kg !== undefined) setDrafts(previous => ({ ...previous, [exercise]: { ...previous[exercise], kg } }));
            }}>{text.copyLoad}</button>}
        </div>
      ) : <p>{referenceStatus === 'ready' ? text.firstOnEquipment : text[referenceStatus]}</p>}
      <SetMeasurements locale={locale} draft={drafts[exercise]} disabled={saving || failed}
        errorId={invalid ? errorId : undefined} onChange={next => {
          setDrafts(previous => ({ ...previous, [exercise]: next }));
          setInvalidExercise(null);
        }} />
      {invalid && <p role="alert" id={errorId}>{text.invalid}</p>}
      <button disabled={saving} type="submit">{submitLabel}</button>
    </form>
  );
}
