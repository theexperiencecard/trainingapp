import { describe, expect, it } from 'vitest';
import { updateProfileAnswer, visibleProfileQuestions } from './profileBranches';

const ids = (answers: Record<string, string[]>) => visibleProfileQuestions(answers).map(({ id }) => id);

describe('questionnaire branches', () => {
  it('asks only applicable questions and stays within ten', () => {
    expect(ids({})).toHaveLength(8);
    expect(ids({ goal: ['strength'], days: ['1'] })).not.toContain('aerobicActivity');
    expect(ids({ goal: ['strength'], days: ['1'] })).not.toContain('spacing');
    expect(ids({ goal: ['aerobic'], days: ['2'] })).toHaveLength(10);
    expect(ids({ goal: ['general'], days: ['7'] })).toContain('aerobicActivity');
    expect(ids({ goal: ['muscle'], days: ['3'] })).toContain('spacing');
    expect(ids({ days: ['2.5'] })).not.toContain('spacing');
  });

  it('clears replies from a branch that no longer applies', () => {
    const answers = {
      goal: ['aerobic'], days: ['2'], aerobicActivity: ['aerobicRegular'], spacing: ['canSpace'],
      avoid: ['avoidBench'],
    };
    const strength = updateProfileAnswer(answers, 'goal', ['strength']);
    expect(strength).not.toHaveProperty('aerobicActivity');
    expect(strength.spacing).toEqual(['canSpace']);
    expect(strength.avoid).toEqual(['avoidBench']);
    const oneDay = updateProfileAnswer(strength, 'days', ['1']);
    expect(oneDay).not.toHaveProperty('spacing');
    const aerobic = updateProfileAnswer(oneDay, 'goal', ['aerobic']);
    expect(ids(aerobic)).toContain('aerobicActivity');
    expect(aerobic).not.toHaveProperty('aerobicActivity');
  });
});
