import { useRef, useState } from 'react';
import { newOperationId, type SetMeasurements } from '../core/journalInput';
import type { Exercise } from '../core/sampleExercises';
import { addSet, addedSetId } from '../storage/localJournal';
import type { LocalJournalState } from './journalUpdates';

export function useGuidedSetRecorder(journal: LocalJournalState) {
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  const operation = useRef<string | null>(null);
  const writing = useRef(false);

  async function save(day: string, exercise: Exercise, values: SetMeasurements, onSaved: (id: string) => void) {
    if (writing.current) return;
    writing.current = true;
    setSaving(true);
    setFailed(false);
    try {
      operation.current ??= newOperationId();
      await addSet(operation.current, day, exercise, values);
      const id = addedSetId(operation.current);
      await journal.announceWrite();
      operation.current = null;
      onSaved(id);
    } catch {
      setFailed(true);
    } finally {
      writing.current = false;
      setSaving(false);
    }
  }

  return { save, saving, failed };
}
