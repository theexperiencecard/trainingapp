import { selectPlan, type PlanCandidate, type PlanProfile } from '../core/planSelection';
import { sampleExerciseIds, sampleExercises } from '../core/sampleExercises';
import { estimateSessionSeconds } from '../core/sessionTiming';

// These times and plans are fixtures for the guided example.
export function sampleDuration(canSwitch: boolean): number {
  return estimateSessionSeconds({
    preparationSeconds: 120,
    setSeconds: [45, 45],
    gaps: [{ recoverySeconds: 120, changeSeconds: canSwitch ? 150 : 0, overlap: true }],
  });
}

const samplePlans = (['strength', 'muscle'] as const).flatMap(goal =>
  sampleExerciseIds.map((id): PlanCandidate => ({
    id, kind: 'example', goal, startingPoints: ['learn', 'resume', 'known', 'clarify'],
    sessionSeconds: [sampleDuration(false)],
    equipment: [sampleExercises[id].equipment],
    preferenceKeys: [sampleExercises[id].avoid],
    requiresSpacedDays: false,
  })),
);

export function samplePlanOptions(profile: PlanProfile | undefined) {
  if (!profile) return sampleExerciseIds;
  const selection = selectPlan(profile, samplePlans, 'example');
  if (selection.compatible.length) {
    return sampleExerciseIds.filter(id => selection.compatible.some(plan => plan.id === id));
  }

  // Keep only examples blocked by time visible so the UI can explain the conflict.
  return sampleExerciseIds.filter(id =>
    selection.rejected.some(plan => plan.id === id && plan.reasons.length === 1 && plan.reasons[0] === 'duration'),
  );
}
