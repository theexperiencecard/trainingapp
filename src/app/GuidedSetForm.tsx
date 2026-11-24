import { useState } from 'react';
import { exampleDraft, readSetDraft, type SetMeasurements as Values } from '../core/journalInput';
import type { Exercise } from '../core/sampleExercises';
import { journalText } from '../locales/journal';
import type { Locale } from '../locales/messages';
import { SetMeasurements } from './SetMeasurements';

type Props = {
  locale: Locale;
  exercise: Exercise;
  saving: boolean;
  failed: boolean;
  submitLabel: string;
  onRecord: (values: Values) => Promise<void>;
};

export function GuidedSetForm({ locale, exercise, saving, failed, submitLabel, onRecord }: Props) {
  const text = journalText[locale];
  const [drafts, setDrafts] = useState(() => ({ bench: exampleDraft('bench'), machine: exampleDraft('machine') }));
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
      <SetMeasurements locale={locale} draft={drafts[exercise]} disabled={saving || failed}
        errorId={invalid ? 'guided-set-invalid' : undefined} onChange={next => {
          setDrafts(previous => ({ ...previous, [exercise]: next }));
          setInvalidExercise(null);
        }} />
      {invalid && <p role="alert" id="guided-set-invalid">{text.invalid}</p>}
      <button disabled={saving} type="submit">{submitLabel}</button>
    </form>
  );
}
