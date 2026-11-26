import type { Exercise } from '../core/sampleExercises';

type ExampleBlock = { exercise: Exercise; repetitions: readonly (number | null)[]; exampleKg?: number | null };

export type ExampleDay = {
  minutes: number;
  blocks: readonly ExampleBlock[];
};

// The two synthetic sessions in docs/26-seduta-forza-r2.md.
const strengthExample = [
  {
    minutes: 23.5,
    blocks: [
      { exercise: 'bench', repetitions: [8, 8] },
      { exercise: 'goblet', repetitions: [10, 9] },
      { exercise: 'row', repetitions: [12, 11] },
    ],
  },
  {
    minutes: 26.5,
    blocks: [
      { exercise: 'bench', repetitions: [8, 7] },
      { exercise: 'trapBar', repetitions: [8, 8] },
      { exercise: 'row', repetitions: [12, 12] },
    ],
  },
] as const satisfies readonly [ExampleDay, ExampleDay];

export type ExampleDayIndex = 0 | 1;

const muscleExample: readonly [ExampleDay, ExampleDay] = [
  { minutes: 28.5, blocks: [
    { exercise: 'bench', repetitions: [12, 11] }, { exercise: 'goblet', repetitions: [12, 11] },
    { exercise: 'row', repetitions: [12, 12] }, { exercise: 'cable', repetitions: [12, 11] },
  ] },
  { minutes: 28.5, blocks: [
    { exercise: 'bench', repetitions: [12, 11] }, { exercise: 'goblet', repetitions: [12, 12] },
    { exercise: 'row', repetitions: [12, 12] }, { exercise: 'cable', repetitions: [12, 11] },
  ] },
];

// The case in docs/28 specifies working measurements only for the goblet squat.
function mixedDays(entry: boolean): readonly [ExampleDay, ExampleDay] {
  const exercises = ['goblet', 'machine', 'row', 'bridge', 'deadBug'] as const;
  const day: ExampleDay = {
    minutes: entry ? 30.75 : 44.5,
    blocks: exercises.map(exercise => {
      if (exercise === 'goblet') return { exercise, repetitions: entry ? [8] : [10, 9], exampleKg: entry ? null : 8 };
      return { exercise, repetitions: entry ? [null] : [null, null], exampleKg: null };
    }),
  };
  return [day, day];
}

export const mixedWalkMinutes = 10;
const entryDays = mixedDays(true);
const familiarDays = mixedDays(false);
export const guidedWeeks = {
  strengthWeek: strengthExample, muscleWeek: muscleExample, entryWeek: entryDays,
  generalWeek: familiarDays, aerobicEntryWeek: entryDays, aerobicWeek: familiarDays,
};
export type GuidedWeek = keyof typeof guidedWeeks;
export type SessionChoice = { week: GuidedWeek; day: ExampleDayIndex };
