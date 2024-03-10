import { describe, test, expect } from 'vitest';

import { RoundUp } from '../src/rounding';
import { Percentage } from '../src/percentage';

describe('Percentage', () => {
  test('Percentage of an invalid denominator', () => {
    expect(() => Percentage.of(2, 0)).toThrow('Invalid denominator');
  });

  test('0 if the numerator is 0', () => {
    expect(Percentage.of(0, 2)).toBe(0);
  });

  test('works correctly for an integer result', () => {
    expect(Percentage.of(1, 2)).toBe(50);
  });

  test('works correctly with default to nearest rounding', () => {
    expect(Percentage.of(1, 3)).toBe(33);
  });

  test('works correctly with round up rounding', () => {
    const rounding = new RoundUp();

    expect(Percentage.of(1, 3, rounding)).toBe(34);
  });
});
