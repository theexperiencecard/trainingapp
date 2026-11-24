import { sampleExerciseIds, sampleExercises, type Exercise } from '../core/sampleExercises';

type CandidateStatus = 'checkEquipment' | 'equipmentMissing' | 'excludedByPreference';

export function pressComparison(answers: Readonly<Record<string, readonly string[]>>) {
  const goal = answers.goal?.[0];
  if (goal !== 'strength' && goal !== 'muscle') return null;

  const { equipment = [], avoid = [] } = answers;
  if (!equipment.length || !avoid.length) return null;

  function status(exercise: Exercise): CandidateStatus {
    const candidate = sampleExercises[exercise];
    if (avoid.includes(candidate.avoid)) return 'excludedByPreference';
    return equipment.includes(candidate.equipment) ? 'checkEquipment' : 'equipmentMissing';
  }

  return { goal, bench: status('bench'), machine: status('machine') };
}

export type PressComparison = ReturnType<typeof pressComparison>;

export function demoExerciseOptions(comparison: PressComparison | undefined): readonly Exercise[] {
  if (comparison === undefined) return sampleExerciseIds;
  if (comparison === null) return [];
  return sampleExerciseIds.filter((exercise) => comparison[exercise] === 'checkEquipment');
}
