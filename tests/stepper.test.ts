import { describe, test, expect } from 'vitest';

import { Stepper } from '../src/stepper';

describe('Stepper', () => {
  describe('validations', () => {
    test('invalid max', () =>
      expect(() => new Stepper({ total: 1.5 })).toThrow(
        'Total value is not an integer'
      ));

    test('negative max', () =>
      expect(() => new Stepper({ total: -1 })).toThrow(
        'Total value should be greater than one'
      ));

    test('max equal zero', () =>
      expect(() => new Stepper({ total: 0 })).toThrow(
        'Total value should be greater than one'
      ));

    test('total equals one', () =>
      expect(() => new Stepper({ total: 1 })).toThrow(
        'Total value should be greater than one'
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

  describe('reset', () => {
    test('returns a new stepper instance', () => {
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

      stepper.reset();

      expect(stepper.read()).toEqual({
        finished: false,
        formatted: '1/3',
        raw: { current: 1, total: 3 },
      });
    });
  });

  describe('format', () => {
    test('returns a string', () => {
      const stepper = new Stepper({ total: 3 });

      stepper.continue();

      expect(stepper.format()).toEqual('2/3');
    });
  });
});
