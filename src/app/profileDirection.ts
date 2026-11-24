import type { PlanGoal, PlanProfile, StartingPoint } from '../core/planSelection';

export function profileDirection(
  answers: Readonly<Record<string, readonly string[]>>,
): { goal: PlanGoal; startingPoint: StartingPoint } | null {
  const goal = answers.goal?.[0];
  if (goal !== 'strength' && goal !== 'muscle' && goal !== 'general' && goal !== 'aerobic') return null;

  return { goal, startingPoint: startingPointFor(goal, answers.experience?.[0], answers.familiar ?? []) };
}

function startingPointFor(goal: PlanGoal, experience: string | undefined, familiar: readonly string[]): StartingPoint {
  if (experience === 'starting') return 'learn';
  if (experience === 'returning') return 'resume';
  const relevantMovements = goal === 'aerobic' ? ['walk'] : ['squat', 'press', 'row'];
  if (experience === 'regular' && relevantMovements.some((movement) => familiar.includes(movement))) {
    return 'known';
  }
  return 'clarify';
}

export function profileFocus(answers: Readonly<Record<string, readonly string[]>>): string | undefined {
  if (answers.goal?.[0] === 'strength') return answers.strengthFocus?.[0];
  if (answers.goal?.[0] === 'muscle') return answers.muscleFocus?.[0];
}

export function planProfileFromAnswers(answers: Readonly<Record<string, readonly string[]>>): PlanProfile {
  const direction = profileDirection(answers);
  const spacing = answers.spacing?.[0];
  return {
    goal: direction?.goal ?? null,
    focus: profileFocus(answers),
    startingPoint: direction?.startingPoint ?? null,
    availableDays: Number(answers.days?.[0]),
    maxSessionSeconds: Number(answers.minutes?.[0]) * 60,
    spacing: spacing === 'canSpace' || spacing === 'consecutiveOnly' || spacing === 'spacingUnknown'
      ? spacing : undefined,
    equipment: answers.equipment ?? [],
    avoidedExercises: answers.avoid ?? [],
  };
}
