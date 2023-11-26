import { describe, test, expect } from 'vitest';

import { Sum } from '../src/sum';

describe('Sum', () => {
  test('works for one value', () => {
    const result = Sum.of([1]);
    expect(result).toEqual(1);
  });

  test('works for two values', () => {
    const result = Sum.of([1, 2]);
    expect(result).toEqual(3);
  });

  test('works for three values', () => {
    const result = Sum.of([1, 3, 6]);
    expect(result).toEqual(10);
  });
});
