import { describe, expect, it } from 'vitest';
import { planProfileFromAnswers } from './profileDirection';
import { samplePlanOptions } from './samplePlanOptions';

const answers = {
  goal: ['strength'], strengthFocus: ['noSpecificFocus'], experience: ['starting'], days: ['1'], minutes: ['25'],
  equipment: ['barbell', 'machine'], avoid: ['noAvoidPreference'],
};

describe('questionnaire to sample catalog', () => {
  it('keeps the standalone demo and respects submitted constraints', () => {
    expect(samplePlanOptions(undefined)).toEqual(['bench', 'machine']);
    expect(samplePlanOptions(planProfileFromAnswers({ ...answers, avoid: ['avoidBench'] }))).toEqual(['machine']);
    expect(samplePlanOptions(planProfileFromAnswers({ ...answers, equipment: ['bodyweight'] }))).toEqual([]);
    expect(samplePlanOptions(planProfileFromAnswers({ ...answers, goal: ['aerobic'] }))).toEqual([]);
  });

  it('keeps a specific strength goal and rejects unrelated exercises', () => {
    for (const strengthFocus of ['gobletFocus', 'rowFocus', 'otherFocus']) {
      expect(samplePlanOptions(planProfileFromAnswers({ ...answers, strengthFocus: [strengthFocus] }))).toEqual([]);
    }
    expect(samplePlanOptions(planProfileFromAnswers({ ...answers, strengthFocus: ['benchFocus'] }))).toEqual(['bench']);
    expect(samplePlanOptions(planProfileFromAnswers({
      ...answers, goal: ['muscle'], muscleFocus: ['chestFocus'],
    }))).toEqual(['bench', 'machine']);
  });

  it('keeps a time-blocked candidate visible for explanation', () => {
    expect(samplePlanOptions(planProfileFromAnswers({
      ...answers, equipment: ['barbell'], minutes: ['5'],
    }))).toEqual(['bench']);
  });
});
