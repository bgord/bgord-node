import { describe, test, expect } from 'vitest';

import { deepMerge } from '../src/deep-merge';

describe('deepMerge function', () => {
  test('merges objects deeply', () => {
    const obj1 = { a: 1, b: { c: 2 }, d: [3, 4] };

    const obj2 = { b: { d: 5 }, d: [6], e: 7 };

    const result = deepMerge(obj1, obj2);

    expect(result).toEqual({ a: 1, b: { c: 2, d: 5 }, d: [3, 4, 6], e: 7 });
  });

  test('merges arrays by concatenating', () => {
    const arr1 = [1, 2];
    const arr2 = [3, 4];

    // @ts-expect-error
    deepMerge(arr1, arr2);
  });

  test('handles undefined inputs', () => {
    const obj = {
      a: 1,
    };

    const result1 = deepMerge(obj, undefined);
    const result2 = deepMerge(undefined, obj);
    const result3 = deepMerge(undefined, undefined);

    expect(result1).toEqual(obj);
    expect(result2).toEqual(obj);
    expect(result3).toEqual({});
  });
});
