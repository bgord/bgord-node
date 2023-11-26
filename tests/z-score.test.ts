import { describe, test, expect } from 'vitest';

import { RoundToNearest } from '../src/rounding';
import { ZScore } from '../src/z-score';

describe('Z-score', () => {
  test('throws for empty values array', () => {
    expect(() => new ZScore([])).toThrow(
      'Values should have at least two values'
    );
  });

  test('throws for one value', () => {
    expect(() => new ZScore([1])).toThrow(
      'Values should have at least two values'
    );
  });

  test('works for two values', () => {
    const result = new ZScore([1, 2]).calculate(1);

    expect(result).toEqual(-1);
  });

  test('works for two values', () => {
    const result = new ZScore([1, 2]).calculate(2);

    expect(result).toEqual(1);
  });

  test('works for a set of values', () => {
    const result = new ZScore([1, 1, 1, 2, 2, 3, 3, 3, 10]).calculate(2);

    expect(result).toEqual(-0.34);
  });

  test('works for a non-default rounding', () => {
    const rounding = new RoundToNearest();
    const result = new ZScore([1, 1, 1, 2, 2, 3, 3, 3, 10], rounding).calculate(
      1
    );

    expect(result).toEqual(-1);
  });
});
