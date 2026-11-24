import { sampleExercises, type PressExercise } from '../core/sampleExercises';

import { profileFocus } from './profileDirection';

type CandidateStatus = 'checkEquipment' | 'equipmentMissing' | 'excludedByPreference';

export function pressComparison(answers: Readonly<Record<string, readonly string[]>>) {
  const goal = answers.goal?.[0];
  if (goal !== 'strength' && goal !== 'muscle') return null;

  const focus = profileFocus(answers);
  if (focus && !['noSpecificFocus', 'benchFocus', 'chestFocus'].includes(focus)) return null;

  const { equipment = [], avoid = [] } = answers;
  if (!equipment.length || !avoid.length) return null;

  function status(exercise: PressExercise): CandidateStatus {
    const candidate = sampleExercises[exercise];
    if (avoid.includes(candidate.avoid)) return 'excludedByPreference';
    return equipment.includes(candidate.equipment) ? 'checkEquipment' : 'equipmentMissing';
  }

  return { goal, bench: status('bench'), machine: status('machine') };
}
