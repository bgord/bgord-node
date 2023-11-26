import { describe, test, expect } from 'vitest';

import { OutlierDetector } from '../src/outlier-detector';

describe('Outlier detector', () => {
  test('throws for empty values array', () => {
    expect(() => new OutlierDetector([], 2)).toThrow(
      'At least two values are needed'
    );
  });

  test('throws for two values array', () => {
    expect(() => new OutlierDetector([], 2)).toThrow(
      'At least two values are needed'
    );
  });

  test('works for three values', () => {
    const values = [1, 3, 10];

    const outlierDetector = new OutlierDetector(values, 2);
    const result = values.filter(value => outlierDetector.check(value));

    expect(result).toEqual([1, 3, 10]);
  });

  test('works for a set of data', () => {
    const values = [1, 3, 1, 3, 1, 3, 10];

    const outlierDetector = new OutlierDetector(values, 2);
    const result = values.filter(value => outlierDetector.check(value));

    expect(result).toEqual([1, 3, 1, 3, 1, 3]);
  });
});
