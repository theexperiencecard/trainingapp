import { expect, it } from 'vitest';
import { mondayOfWeek } from './journalWeek';

it.each([
  ['2027-01-01', '2026-12-28'], ['2027-01-03', '2026-12-28'], ['2027-01-04', '2027-01-04'],
  ['2026-03-29', '2026-03-23'], ['2026-10-25', '2026-10-19'],
])('groups the stored date %s under Monday %s', (day, monday) => {
  expect(mondayOfWeek(day)).toBe(monday);
});
