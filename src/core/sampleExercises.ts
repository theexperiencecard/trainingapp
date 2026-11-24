// Fixtures for the internal preview. Keep the saved configuration IDs and load conventions stable.
export const sampleExercises = {
  bench: {
    equipment: 'barbell',
    avoid: 'avoidBench',
    set: { configuration: 'flat-bench-barbell', convention: 'total-including-bar', kg: 40, reps: 12 },
  },
  machine: {
    equipment: 'machine',
    avoid: 'avoidMachinePress',
    set: { configuration: 'chest-press-M1', convention: 'machine-indicated', kg: 25, reps: 10 },
  },
  goblet: {
    set: { configuration: 'goblet-single-dumbbell', convention: 'single-dumbbell', kg: 16, reps: 10 },
  },
  row: {
    set: { configuration: 'incline-bilateral-dumbbell-row', convention: 'total-both-dumbbells', kg: 20, reps: 12 },
  },
  trapBar: {
    set: { configuration: 'trap-bar-deadlift', convention: 'total-including-bar', kg: 50, reps: 8 },
  },
} as const;

export type Exercise = keyof typeof sampleExercises;
export const pressExerciseIds = ['bench', 'machine'] as const satisfies readonly Exercise[];
export type PressExercise = (typeof pressExerciseIds)[number];
export const sampleExerciseIds = [...pressExerciseIds, 'goblet', 'row', 'trapBar'] as const satisfies readonly Exercise[];

export function exampleDrafts<T>(create: (exercise: Exercise) => T): Record<Exercise, T> {
  return {
    bench: create('bench'), machine: create('machine'), goblet: create('goblet'),
    row: create('row'), trapBar: create('trapBar'),
  };
}
