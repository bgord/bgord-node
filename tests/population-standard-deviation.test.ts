import { describe, test, expect } from 'vitest';
import { PopulationStandardDeviation } from '../src/population-standard-deviation';

describe('Standard Deviation Calculation', () => {
  test('throws an error for an empty set of values', () => {
    expect(() => PopulationStandardDeviation.calculate([])).toThrow(
      'Values should have at least two values'
    );
  });

  test('throws an error for a single value', () => {
    expect(() => PopulationStandardDeviation.calculate([1])).toThrow(
      'Values should have at least two values'
    );
  });

  test('calculates standard deviation for two values', () => {
    const result = PopulationStandardDeviation.calculate([1, 2]);
    expect(result).toEqual(0.5);
  });

  test('calculates standard deviation for three values', () => {
    const result = PopulationStandardDeviation.calculate([1, 2, 3]);
    expect(result).toEqual(0.82);
  });

  test('calculates standard deviation for a set of numbers', () => {
    // prettier-ignore
    const result = PopulationStandardDeviation.calculate([
      2, 4, 4, 4, 5, 5, 7, 9,
    ]);
    expect(result).toEqual(2);
  });

  test('calculates standard deviation for another set of numbers', () => {
    // prettier-ignore
    const result = PopulationStandardDeviation.calculate([
      1, 1, 1, 1, 1, 1, 10,
    ]);
    expect(result).toEqual(3.15);
  });
});
