import { describe, test, expect } from 'vitest';

import {
  RoundUp,
  RoundDown,
  RoundToDecimal,
  RoundToNearest,
} from '../src/rounding';

describe('Rounding Strategies', () => {
  test('RoundToNearest rounds to the nearest integer', () => {
    const rounding = new RoundToNearest();
    expect(rounding.round(5.6)).toBe(6);
    expect(rounding.round(3.2)).toBe(3);
  });

  test('RoundUp always rounds up to the next integer', () => {
    const rounding = new RoundUp();
    expect(rounding.round(5.6)).toBe(6);
    expect(rounding.round(3.2)).toBe(4);
  });

  test('RoundDown always rounds down to the previous integer', () => {
    const rounding = new RoundDown();
    expect(rounding.round(5.6)).toBe(5);
    expect(rounding.round(3.2)).toBe(3);
  });

  test('RoundToDecimal rounds to the specified number of decimals', () => {
    const rounding = new RoundToDecimal(2);
    expect(rounding.round(5.678)).toBe(5.68);
    expect(rounding.round(3.245)).toBe(3.25);
  });

  test('RoundToDecimal handles negative decimals', () => {
    const rounding = new RoundToDecimal(-2);
    expect(() => rounding.round(5678)).toThrow();
    expect(() => rounding.round(3245)).toThrow();
  });
});
