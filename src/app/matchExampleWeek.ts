// Read-only illustrations from the documented cases in docs/26, 27 and 28.
import { selectPlan, type PlanCandidate, type PlanGoal, type StartingPoint } from '../core/planSelection';
import { planProfileFromAnswers } from './profileDirection';
import { guidedWeeks, mixedWalkMinutes, type GuidedWeek } from './guidedWeeks';

type Day = { minutes: number; movements: readonly string[] };
type ExampleWeek = {
  description: GuidedWeek;
  setup: string;
  days: readonly [Day, Day];
  walkMinutesPerDay: number;
  equipment: string[];
  exclusions: string[];
  familiar: string[];
  startingPoints: StartingPoint[];
  focuses?: string[];
};

function exampleDay(family: GuidedWeek, index: 0 | 1): Day {
  const day = guidedWeeks[family][index];
  return { minutes: day.minutes, movements: day.blocks.map(block => block.exercise) };
}

const strength: ExampleWeek = {
  description: 'strengthWeek', setup: 'strengthSetup', walkMinutesPerDay: 0,
  days: [exampleDay('strengthWeek', 0), exampleDay('strengthWeek', 1)],
  equipment: ['barbell', 'dumbbells'], exclusions: ['avoidBench', 'avoidSquat'],
  familiar: ['press', 'squat', 'row'], startingPoints: ['known'], focuses: ['benchFocus'],
};
const muscle: ExampleWeek = {
  ...strength, description: 'muscleWeek', setup: 'muscleSetup', days: [exampleDay('muscleWeek', 0), exampleDay('muscleWeek', 1)],
  equipment: ['barbell', 'dumbbells', 'machine'], focuses: ['chestFocus'],
};

function mixedWeek(goal: PlanGoal, entry: boolean): ExampleWeek {
  const description = goal === 'general' ? (entry ? 'entryWeek' : 'generalWeek')
      : (entry ? 'aerobicEntryWeek' : 'aerobicWeek');
  return {
    description, setup: 'mixedSetup', days: [exampleDay(description, 0), exampleDay(description, 1)],
    walkMinutesPerDay: mixedWalkMinutes,
    equipment: ['dumbbells', 'machine'], exclusions: ['avoidSquat', 'avoidMachinePress'],
    familiar: entry ? ['walk'] : ['walk', 'squat', 'row'],
    startingPoints: entry ? ['learn', 'resume'] : ['known'],
  };
}

export function weekPreview(answers: Readonly<Record<string, readonly string[]>>):
  { week: ExampleWeek | null; reasons: string[] } {
  const profile = planProfileFromAnswers(answers);
  const { goal, startingPoint } = profile;
  if (!goal || !startingPoint) return { week: null, reasons: [] };
  const entry = startingPoint === 'learn' || startingPoint === 'resume';
  const week = goal === 'strength' ? strength : goal === 'muscle' ? muscle : mixedWeek(goal, entry);
  if (week.focuses && !profile.focus) return { week: null, reasons: ['incomplete'] };
  const candidate: PlanCandidate = {
    id: week.description, kind: 'example', goal, startingPoints: week.startingPoints,
    sessionSeconds: week.days.map(day => day.minutes * 60), supportedFocuses: week.focuses ?? [],
    equipment: week.equipment, preferenceKeys: week.exclusions, requiresSpacedDays: true,
  };
  const selection = selectPlan(profile, [candidate], 'example');
  const reasons: string[] = [...(selection.rejected[0]?.reasons ?? [])];
  if (selection.status === 'profileIncomplete') reasons.push('incomplete');
  if (!reasons.includes('startingPoint') && week.familiar.some(move => !answers.familiar?.includes(move))) {
    reasons.push('familiarity');
  }
  if (week.walkMinutesPerDay > 0 && !['aerobicRegular', 'aerobicSometimes'].includes(answers.aerobicActivity?.[0] ?? '')) {
    reasons.push('walking');
  }
  return { week: selection.selected && !reasons.length ? week : null, reasons };
}
