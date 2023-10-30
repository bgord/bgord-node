import { describe, test, expect } from 'vitest';

import { Random } from '../src/random';

describe('Random', () => {
  describe('validations', () => {
    test('invalid min', () => {
      expect(() => Random.generate({ min: 1.5, max: 2 })).toThrow(
        'Minimum value is not an integer'
      );
    });

    test('invalid max', () => {
      expect(() => Random.generate({ min: 1, max: 2.5 })).toThrow(
        'Maximum value is not an integer'
      );
    });

    test('min equals max', () => {
      expect(() => Random.generate({ min: 1, max: 1 })).toThrow(
        'Minimum and maximum values cannot be equal'
      );
    });

    test('min greater than max', () => {
      expect(() => Random.generate({ min: 2, max: 1 })).toThrow(
        'Minimum value cannot be greater than maximum value'
      );
    });
  });

  describe('generate', () => {
    test('default config', () => {
      const result = Random.generate();
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
    });

    test('min 1, max 10', () => {
      const result = Random.generate({ min: 1, max: 10 });
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    });
  });
});
