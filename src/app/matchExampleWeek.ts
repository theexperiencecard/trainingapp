// Read-only illustrations from the documented cases in docs/26, 27 and 28.
import { selectPlan, type PlanCandidate, type PlanGoal, type StartingPoint } from '../core/planSelection';
import { planProfileFromAnswers } from './profileDirection';

type Day = { minutes: number; movements: readonly string[] };
type ExampleWeek = {
  description: string;
  setup: string;
  days: readonly [Day, Day];
  walk: boolean;
  equipment: string[];
  exclusions: string[];
  familiar: string[];
  startingPoints: StartingPoint[];
  focuses?: string[];
};

const strength: ExampleWeek = {
  description: 'strengthWeek', setup: 'strengthSetup', walk: false,
  days: [
    { minutes: 23.5, movements: ['bench', 'goblet', 'row'] },
    { minutes: 26.5, movements: ['bench', 'trapBar', 'row'] },
  ],
  equipment: ['barbell', 'dumbbells'], exclusions: ['avoidBench', 'avoidSquat'],
  familiar: ['press', 'squat', 'row'], startingPoints: ['known'], focuses: ['benchFocus'],
};
const muscleDay = { minutes: 28.5, movements: ['bench', 'goblet', 'row', 'cable'] };
const muscle: ExampleWeek = {
  ...strength, description: 'muscleWeek', setup: 'muscleSetup', days: [muscleDay, muscleDay],
  equipment: ['barbell', 'dumbbells', 'machine'], focuses: ['chestFocus'],
};

function mixedWeek(goal: PlanGoal, entry: boolean): ExampleWeek {
  const day = { minutes: entry ? 30.75 : 44.5, movements: ['goblet', 'pressMachine', 'row', 'bridge', 'deadBug'] };
  return {
    description: goal === 'general' ? (entry ? 'entryWeek' : 'generalWeek')
      : (entry ? 'aerobicEntryWeek' : 'aerobicWeek'),
    setup: 'mixedSetup', days: [day, day], walk: true,
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
  if (week.walk && !['aerobicRegular', 'aerobicSometimes'].includes(answers.aerobicActivity?.[0] ?? '')) {
    reasons.push('walking');
  }
  return { week: selection.selected && !reasons.length ? week : null, reasons };
}
