import { describe, test, expect } from 'vitest';

import { Stepper } from '../src/stepper';

describe('Stepper', () => {
  describe('validations', () => {
    test('invalid max', () =>
      expect(() => new Stepper({ total: 1.5 })).toThrow(
        'Maximum value is not an integer'
      ));

    test('max equal zero', () =>
      expect(() => new Stepper({ total: 0 })).toThrow(
        'Maximum value should be positive'
      ));

    test('negative max', () =>
      expect(() => new Stepper({ total: -1 })).toThrow(
        'Maximum value should be positive'
      ));
  });

  describe('continue', () => {
    test('happy path', () => {
      const stepper = new Stepper({ total: 3 });

      expect(stepper.read()).toEqual({
        finished: false,
        formatted: '1/3',
        raw: { current: 1, total: 3 },
      });

      stepper.continue();

      expect(stepper.read()).toEqual({
        finished: false,
        formatted: '2/3',
        raw: { current: 2, total: 3 },
      });

      stepper.continue();

      expect(stepper.read()).toEqual({
        finished: true,
        formatted: '3/3',
        raw: { current: 3, total: 3 },
      });

      expect(() => stepper.continue()).toThrow('Stepper is finished');
    });
  });
});
