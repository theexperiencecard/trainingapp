type Goal = 'strength' | 'muscle' | 'general' | 'aerobic';
type StartingPoint = 'learn' | 'resume' | 'known' | 'clarify';

export function profileDirection(answers: Readonly<Record<string, readonly string[]>>) {
  const goal = answers.goal?.[0];
  if (goal !== 'strength' && goal !== 'muscle' && goal !== 'general' && goal !== 'aerobic') return null;

  return { goal, startingPoint: startingPointFor(goal, answers.experience?.[0], answers.familiar ?? []) };
}

function startingPointFor(goal: Goal, experience: string | undefined, familiar: readonly string[]): StartingPoint {
  if (experience === 'starting') return 'learn';
  if (experience === 'returning') return 'resume';
  const relevantMovements = goal === 'aerobic' ? ['walk'] : ['squat', 'press', 'row'];
  if (experience === 'regular' && relevantMovements.some((movement) => familiar.includes(movement))) {
    return 'known';
  }
  return 'clarify';
}
