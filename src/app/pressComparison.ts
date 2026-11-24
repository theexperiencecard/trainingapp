type CandidateStatus = 'checkEquipment' | 'equipmentMissing' | 'excludedByPreference';

export function pressComparison(answers: Readonly<Record<string, readonly string[]>>) {
  const goal = answers.goal?.[0];
  if (goal !== 'strength' && goal !== 'muscle') return null;

  const { equipment = [], avoid = [] } = answers;
  if (!equipment.length || !avoid.length) return null;

  function status(equipmentId: string, avoidId: string): CandidateStatus {
    if (avoid.includes(avoidId)) return 'excludedByPreference';
    return equipment.includes(equipmentId) ? 'checkEquipment' : 'equipmentMissing';
  }

  return { goal, bench: status('barbell', 'avoidBench'), machine: status('machine', 'avoidMachinePress') };
}
