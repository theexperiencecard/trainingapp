export type PlanGoal = 'strength' | 'muscle' | 'general' | 'aerobic';
export type StartingPoint = 'learn' | 'resume' | 'known' | 'clarify';
export type SessionSpacing = 'canSpace' | 'consecutiveOnly' | 'spacingUnknown';

export type PlanProfile = {
  goal: PlanGoal | null;
  startingPoint: StartingPoint | null;
  availableDays: number;
  maxSessionSeconds: number;
  spacing: SessionSpacing | undefined;
  equipment: readonly string[];
  avoidedExercises: readonly string[];
};

export type PlanCandidate = {
  id: string;
  kind: 'example' | 'reviewed';
  goal: PlanGoal;
  startingPoints: readonly StartingPoint[];
  sessionSeconds: readonly number[];
  equipment: readonly string[];
  preferenceKeys: readonly string[];
  requiresSpacedDays: boolean;
};

type RejectionReason = 'startingPoint' | 'days' | 'duration' | 'equipment' | 'preference' | 'spacing' | 'invalidTiming';
type Selection = {
  status: 'selected' | 'noCompatiblePlan' | 'catalogUnavailable' | 'profileIncomplete';
  selected: PlanCandidate | null;
  compatible: PlanCandidate[];
  rejected: { id: string; reasons: RejectionReason[] }[];
};

function isPositiveInteger(value: number): boolean {
  return Number.isSafeInteger(value) && value > 0;
}

// The catalog order is the declared priority. This layer checks fit without changing any session.
export function selectPlan(
  profile: PlanProfile,
  catalog: readonly PlanCandidate[],
  mode: PlanCandidate['kind'],
): Selection {
  if (!profile.goal || !profile.startingPoint || (mode === 'reviewed' && profile.startingPoint === 'clarify') ||
      !isPositiveInteger(profile.availableDays) || !isPositiveInteger(profile.maxSessionSeconds) ||
      profile.equipment.length === 0) {
    return { status: 'profileIncomplete', selected: null, compatible: [], rejected: [] };
  }

  const candidates = catalog.filter(candidate => candidate.kind === mode);
  if (candidates.length === 0) {
    return { status: 'catalogUnavailable', selected: null, compatible: [], rejected: [] };
  }

  const compatible: PlanCandidate[] = [];
  const rejected: Selection['rejected'] = [];
  for (const candidate of candidates) {
    if (candidate.goal !== profile.goal) continue;
    const reasons = checkFit(profile, profile.startingPoint, candidate);
    if (reasons.length) rejected.push({ id: candidate.id, reasons });
    else compatible.push(candidate);
  }
  const selected = compatible[0] ?? null;
  return { status: selected ? 'selected' : 'noCompatiblePlan', selected, compatible, rejected };
}

function checkFit(profile: PlanProfile, startingPoint: StartingPoint, candidate: PlanCandidate): RejectionReason[] {
  const reasons: RejectionReason[] = [];
  if (!candidate.startingPoints.includes(startingPoint)) reasons.push('startingPoint');
  if (candidate.sessionSeconds.length > profile.availableDays) reasons.push('days');
  if (!candidate.sessionSeconds.length || !candidate.sessionSeconds.every(isPositiveInteger)) reasons.push('invalidTiming');
  else if (candidate.sessionSeconds.some(seconds => seconds > profile.maxSessionSeconds)) reasons.push('duration');
  if (candidate.equipment.some(equipment => !profile.equipment.includes(equipment))) reasons.push('equipment');
  if (candidate.preferenceKeys.some(exercise => profile.avoidedExercises.includes(exercise))) reasons.push('preference');
  if (candidate.requiresSpacedDays && candidate.sessionSeconds.length > 1 && profile.spacing !== 'canSpace') {
    reasons.push('spacing');
  }
  return reasons;
}
