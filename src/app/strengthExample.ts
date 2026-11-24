import type { Exercise } from '../core/sampleExercises';

type ExampleBlock = { exercise: Exercise; repetitions: readonly number[] };

type StrengthDay = {
  minutes: number;
  blocks: readonly ExampleBlock[];
};

// The two synthetic sessions in docs/26-seduta-forza-r2.md.
export const strengthExample = [
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
] as const satisfies readonly [StrengthDay, StrengthDay];

export type StrengthDayIndex = 0 | 1;
