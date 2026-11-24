import type { Locale } from '../locales/messages';
import { parseDecimal, validMeasurement, type SetDraft } from '../core/journalInput';
import { journalText } from '../locales/journal';

type Props = {
  locale: Locale;
  draft: SetDraft;
  disabled: boolean;
  errorId: string | undefined;
  onChange: (value: SetDraft) => void;
};

export function SetMeasurements({ locale, draft, disabled, errorId, onChange }: Props) {
  const text = journalText[locale];
  return (
    <>
      <div className="journal-inputs">
        {(['kg', 'reps', 'rir'] as const).map(field => (
          <label key={field}>{text[field]}
            <input type="text" inputMode={field === 'kg' ? 'decimal' : 'numeric'} disabled={disabled}
              value={draft[field]} required={field === 'reps'}
              aria-invalid={Boolean(errorId) && !validMeasurement(field, parseDecimal(draft[field]))}
              aria-describedby={errorId} onChange={event => onChange({ ...draft, [field]: event.target.value })} />
          </label>
        ))}
      </div>
      <p>{text.rirHint}</p>
      <p>{text.optional}</p>
    </>
  );
}
