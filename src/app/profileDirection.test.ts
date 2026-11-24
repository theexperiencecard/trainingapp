import { describe, expect, it } from 'vitest';
import { profileDirection } from './profileDirection';

describe('questionnaire direction', () => {
  it('keeps the different goals for people starting from the same point', () => {
    const answers = { experience: ['starting'], familiar: ['noneFamiliar'] };
    expect(profileDirection({ ...answers, goal: ['strength'] })).toEqual({
      goal: 'strength', startingPoint: 'learn',
    });
    expect(profileDirection({ ...answers, goal: ['aerobic'] })).toEqual({
      goal: 'aerobic', startingPoint: 'learn',
    });
  });

  it('asks for the goal before suggesting a direction', () => {
    expect(profileDirection({ goal: ['undecided'] })).toBeNull();
  });

  it('keeps the goal while clarifying an unknown starting point', () => {
    expect(profileDirection({ goal: ['muscle'], experience: ['experienceUnknown'] })).toEqual({
      goal: 'muscle', startingPoint: 'clarify',
    });
  });

  it('uses familiar movements relevant to the chosen goal', () => {
    const answers = { experience: ['regular'], familiar: ['walk'] };
    expect(profileDirection({ ...answers, goal: ['strength'] })?.startingPoint).toBe('clarify');
    expect(profileDirection({ ...answers, goal: ['aerobic'] })?.startingPoint).toBe('known');
  });

  it('keeps a return distinct from training regularly', () => {
    const answers = { goal: ['general'], familiar: ['squat'] };
    expect(profileDirection({ ...answers, experience: ['returning'] })?.startingPoint).toBe('resume');
    expect(profileDirection({ ...answers, experience: ['regular'] })?.startingPoint).toBe('known');
  });
});
