import { describe, expect, it } from 'vitest';
import { planProfileFromAnswers } from './profileDirection';
import { samplePlanOptions } from './samplePlanOptions';

const answers = {
  goal: ['strength'], experience: ['starting'], days: ['1'], minutes: ['25'],
  equipment: ['barbell', 'machine'], avoid: ['noAvoidPreference'],
};

describe('questionnaire to sample catalog', () => {
  it('keeps the standalone demo and respects submitted constraints', () => {
    expect(samplePlanOptions(undefined)).toEqual(['bench', 'machine']);
    expect(samplePlanOptions(planProfileFromAnswers({ ...answers, avoid: ['avoidBench'] }))).toEqual(['machine']);
    expect(samplePlanOptions(planProfileFromAnswers({ ...answers, equipment: ['bodyweight'] }))).toEqual([]);
    expect(samplePlanOptions(planProfileFromAnswers({ ...answers, goal: ['aerobic'] }))).toEqual([]);
  });

  it('keeps a time-blocked candidate visible for explanation', () => {
    expect(samplePlanOptions(planProfileFromAnswers({
      ...answers, equipment: ['barbell'], minutes: ['5'],
    }))).toEqual(['bench']);
  });
});
