import type { Locale } from '../locales/messages';
import { usesExternalLoad, type Exercise } from '../core/sampleExercises';
import { parseDecimal, validMeasurement, type SetDraft } from '../core/journalInput';
import { journalText } from '../locales/journal';

type Props = {
  locale: Locale;
  exercise: Exercise;
  draft: SetDraft;
  disabled: boolean;
  errorId: string | undefined;
  onChange: (value: SetDraft) => void;
};

export function SetMeasurements({ locale, exercise, draft, disabled, errorId, onChange }: Props) {
  const text = journalText[locale];
  return (
    <>
      <div className="journal-inputs">
        {(['kg', 'reps', 'rir'] as const).filter(field => field !== 'kg' || usesExternalLoad(exercise)).map(field => (
          <label key={field}>{text[field === 'reps' && exercise === 'deadBug' ? 'repsPerSide' : field]}
            <input type="text" inputMode={field === 'kg' ? 'decimal' : 'numeric'} disabled={disabled}
              value={draft[field]} required={field === 'reps'}
              aria-invalid={Boolean(errorId) && !validMeasurement(field, parseDecimal(draft[field]))}
              aria-describedby={errorId} onChange={event => onChange({ ...draft, [field]: event.target.value })} />
          </label>
        ))}
      </div>
      <p>{text.rirHint}</p>
      {usesExternalLoad(exercise) && <p>{text.optional}</p>}
    </>
  );
}
