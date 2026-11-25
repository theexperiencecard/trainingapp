// Training days are stored as calendar dates. UTC keeps calendar arithmetic independent of travel and DST.
export function mondayOfWeek(day: string): string {
  const date = new Date(day + 'T00:00:00Z');
  const daysSinceMonday = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - daysSinceMonday);
  return date.toISOString().slice(0, 10);
}
