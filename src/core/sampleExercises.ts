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
} as const;

export type Exercise = keyof typeof sampleExercises;
export const sampleExerciseIds = ['bench', 'machine'] as const satisfies readonly Exercise[];
