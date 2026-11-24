import { describe, expect, it } from 'vitest';
import { pressComparison } from './pressComparison';

describe('press comparison for completed profiles', () => {
  it('skips the comparison when neither strength nor muscle gain was chosen', () => {
    for (const goal of ['general', 'aerobic', 'undecided']) {
      expect(pressComparison({ goal: [goal], equipment: ['barbell', 'machine'], avoid: ['noAvoidPreference'] })).toBeNull();
    }
  });

  it('distinguishes unavailable equipment from an unconfirmed candidate', () => {
    expect(pressComparison({ goal: ['strength'], equipment: ['barbell'], avoid: ['noAvoidPreference'] })).toEqual({
      goal: 'strength', bench: 'checkEquipment', machine: 'equipmentMissing',
    });
    expect(pressComparison({ goal: ['muscle'], equipment: ['bodyweight'], avoid: ['noAvoidPreference'] })).toEqual({
      goal: 'muscle', bench: 'equipmentMissing', machine: 'equipmentMissing',
    });
  });

  it('respects each preference even when the equipment is declared', () => {
    expect(pressComparison({
      goal: ['muscle'], equipment: ['barbell', 'machine'], avoid: ['avoidBench'],
    })).toEqual({ goal: 'muscle', bench: 'excludedByPreference', machine: 'checkEquipment' });
    expect(pressComparison({
      goal: ['strength'], equipment: ['barbell', 'machine'], avoid: ['avoidMachinePress'],
    })).toEqual({ goal: 'strength', bench: 'checkEquipment', machine: 'excludedByPreference' });
  });

  it('withholds the comparison when equipment or preferences have not been answered', () => {
    expect(pressComparison({ goal: ['strength'] })).toBeNull();
    expect(pressComparison({ goal: ['strength'], equipment: ['barbell'] })).toBeNull();
  });
});
