import { expect, it } from 'vitest';
import { weekPreview } from './matchExampleWeek';
import { guidedWeeks } from './guidedWeeks';

const base = {
  goal: ['strength'], strengthFocus: ['benchFocus'], experience: ['regular'],
  familiar: ['press', 'squat', 'row', 'walk'], days: ['2'], spacing: ['canSpace'],
  minutes: ['30'], equipment: ['barbell', 'dumbbells', 'machine'], avoid: ['noAvoidPreference'],
};

it('shows two different weeks for specific strength and muscle priorities', () => {
  const strength = weekPreview(base).week;
  expect(strength?.days[1]?.movements).toContain('trapBar');
  const muscle = weekPreview({ ...base, goal: ['muscle'], muscleFocus: ['chestFocus'] }).week;
  expect(muscle?.days[1]?.movements).toContain('cable');
  expect(weekPreview({ ...base, strengthFocus: ['gobletFocus'] }).week).toBeNull();
});

it('checks the longer day and respects spacing, familiar movements and exclusions', () => {
  for (const change of [
    { minutes: ['26'] }, { days: ['1'] }, { spacing: ['consecutiveOnly'] },
    { familiar: ['press'] }, { equipment: ['barbell'] }, { avoid: ['avoidSquat'] },
    { experience: ['starting'] },
  ]) expect(weekPreview({ ...base, ...change }).week).toBeNull();
});

it('distinguishes entry, general fitness and aerobic priority on the same calendar', () => {
  const mixed = { ...base, minutes: ['45'], aerobicActivity: ['aerobicRegular'] };
  expect(weekPreview({ ...mixed, goal: ['general'], experience: ['returning'] }).week?.description).toBe('entryWeek');
  expect(weekPreview({ ...mixed, goal: ['general'] }).week?.description).toBe('generalWeek');
  expect(weekPreview({ ...mixed, goal: ['aerobic'] }).week?.description).toBe('aerobicWeek');
  expect(weekPreview({ ...mixed, goal: ['aerobic'], experience: ['starting'] }).week?.description).toBe('aerobicEntryWeek');
  expect(weekPreview({ ...mixed, goal: ['aerobic'], aerobicActivity: ['aerobicNone'] }).week).toBeNull();
  expect(weekPreview({ ...mixed, goal: ['aerobic'], familiar: ['walk'] }).week).toBeNull();
});

it.each([
  ['general', 'returning', 1], ['general', 'regular', 2],
  ['aerobic', 'starting', 1], ['aerobic', 'regular', 2],
] as const)('guides both mixed days for %s / %s', (goal, experience, setCount) => {
  const { week } = weekPreview({ ...base, goal: [goal], experience: [experience],
    minutes: ['45'], aerobicActivity: ['aerobicRegular'] });
  expect(week).toBeTruthy();
  for (const day of guidedWeeks[week!.description]) {
    expect(day.blocks.map(block => block.exercise)).toEqual(['goblet', 'machine', 'row', 'bridge', 'deadBug']);
    expect(day.blocks.map(block => block.repetitions.length)).toEqual(Array(5).fill(setCount));
    expect(day.minutes).toBe(setCount === 1 ? 30.75 : 44.5);
  }
});
