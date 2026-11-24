import type { Exercise } from '../core/sampleExercises';

type ExampleBlock = { exercise: Exercise; repetitions: readonly number[] };

type ExampleDay = {
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

export const guidedWeeks = { strengthWeek: strengthExample, muscleWeek: muscleExample };
export type GuidedWeek = keyof typeof guidedWeeks;
export type SessionChoice = { week: GuidedWeek; day: ExampleDayIndex };
