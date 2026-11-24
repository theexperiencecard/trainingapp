import { describe, expect, it } from 'vitest';
import { selectPlan, type PlanCandidate, type PlanProfile } from './planSelection';

const profile: PlanProfile = {
  goal: 'strength', startingPoint: 'learn', availableDays: 2, maxSessionSeconds: 25 * 60,
  spacing: 'canSpace', equipment: ['bodyweight'], avoidedExercises: [],
};
const strength: PlanCandidate = {
  id: 'strength-example', kind: 'example', goal: 'strength', startingPoints: ['learn'],
  sessionSeconds: [1200, 1400], equipment: [], preferenceKeys: ['exercise-a'],
  requiresSpacedDays: true,
};
const aerobic: PlanCandidate = { ...strength, id: 'aerobic-example', goal: 'aerobic' };

describe('plan selection', () => {
  it('selects the correct goal for beginners with otherwise identical answers', () => {
    const catalog = [aerobic, strength];
    expect(selectPlan(profile, catalog, 'example').selected?.id).toBe(strength.id);
    expect(selectPlan({ ...profile, goal: 'aerobic' }, catalog, 'example').selected?.id).toBe(aerobic.id);
  });

  it('reports why a candidate fails and never forces it into the user’s constraints', () => {
    const result = selectPlan({
      ...profile, availableDays: 1, maxSessionSeconds: 1300,
      spacing: 'consecutiveOnly', avoidedExercises: ['exercise-a'],
    }, [{ ...strength, equipment: ['barbell'] }], 'example');
    expect(result.selected).toBeNull();
    expect(result.rejected).toEqual([{
      id: strength.id, reasons: ['days', 'duration', 'equipment', 'preference', 'spacing'],
    }]);
  });

  it('uses a feasible alternative and keeps candidate order as the explicit priority', () => {
    const shorter = { ...strength, id: 'shorter', sessionSeconds: [600, 600] };
    const other = { ...shorter, id: 'other' };
    const result = selectPlan({ ...profile, maxSessionSeconds: 900 }, [strength, shorter, other], 'example');
    expect(result.selected?.id).toBe(shorter.id);
    expect(result.compatible.map(({ id }) => id)).toEqual([shorter.id, other.id]);
  });

  it('keeps examples out of real selection and asks for an unclear starting point', () => {
    expect(selectPlan(profile, [strength], 'reviewed').status).toBe('catalogUnavailable');
    const reviewed = { ...strength, kind: 'reviewed' } as const;
    expect(selectPlan({ ...profile, startingPoint: 'clarify' }, [reviewed], 'reviewed').status)
      .toBe('profileIncomplete');
    expect(selectPlan({ ...profile, goal: null }, [reviewed], 'reviewed').status).toBe('profileIncomplete');
  });

  it('rejects unknown spacing when a candidate requires rest days', () => {
    const result = selectPlan({ ...profile, spacing: 'spacingUnknown' }, [strength], 'example');
    expect(result.rejected[0]?.reasons).toEqual(['spacing']);
  });
});
