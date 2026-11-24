import { describe, expect, it } from 'vitest';
import { localDate, newOperationId, parseDecimal, validMeasurement } from './journalInput';

describe('journal input', () => {
  it('uses the calendar date where the set was logged', () => {
    expect(localDate(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });

  it('reads a decimal comma or point and separates empty input from zero', () => {
    expect(parseDecimal(' 42,5 ')).toBe(42.5);
    expect(parseDecimal('42.5')).toBe(42.5);
    expect(parseDecimal(' 0 ')).toBe(0);
    expect(parseDecimal(' ')).toBeNull();
    for (const value of ['4x', '1,2.3', '0x16', '1e3']) expect(parseDecimal(value)).toBeNaN();
  });

  it('accepts unknown load or RIR and requires a positive integer repetition count', () => {
    expect(validMeasurement('kg', null)).toBe(true);
    expect(validMeasurement('rir', null)).toBe(true);
    expect(validMeasurement('reps', null)).toBe(false);
    expect(validMeasurement('reps', 0)).toBe(false);
    expect(validMeasurement('reps', 1)).toBe(true);
    expect(validMeasurement('kg', 0)).toBe(true);
    expect(validMeasurement('kg', 42.5)).toBe(true);
    expect(validMeasurement('rir', 0)).toBe(true);
    expect(validMeasurement('rir', 1.5)).toBe(false);
  });

  it('rejects invalid or numerically unrepresentable measurements', () => {
    for (const value of [NaN, Infinity, -1, Number.MAX_VALUE]) {
      expect(validMeasurement('kg', value)).toBe(false);
      expect(validMeasurement('rir', value)).toBe(false);
    }
    expect(validMeasurement('reps', Number.MAX_SAFE_INTEGER + 1)).toBe(false);
  });

  it('generates different IDs for different confirmations', () => {
    expect(newOperationId()).not.toBe(newOperationId());
  });
});
