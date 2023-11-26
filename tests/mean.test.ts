import { describe, test, expect } from 'vitest';

import { RoundToNearest } from '../src/rounding';
import { Mean } from '../src/mean';

describe('Mean', () => {
  test('throws for empty values array', () => {
    expect(() => Mean.calculate([])).toThrow('Values should not be empty');
  });

  test('works for one value', () => {
    const result = Mean.calculate([1]);

    expect(result).toEqual(1);
  });

  test('works for two values', () => {
    const result = Mean.calculate([1, 2]);

    expect(result).toEqual(1.5);
  });

  test('works for three values', () => {
    const result = Mean.calculate([1, 3, 6]);

    expect(result).toEqual(3.33);
  });

  test('works with non-default rounding', () => {
    const rounding = new RoundToNearest();
    const result = Mean.calculate([1, 3, 6], rounding);

    expect(result).toEqual(3);
  });
});
