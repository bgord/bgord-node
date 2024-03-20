import { describe, test, expect } from 'vitest';

import { LeapYearChecker } from '../src/leap-year-checker';

describe('LeapYearChecker', () => {
  describe('isLeapYear', () => {
    test('works for 2000', () =>
      expect(LeapYearChecker.isLeapYear(2000)).toBe(true));

    test('works for 2001', () =>
      expect(LeapYearChecker.isLeapYear(2001)).toBe(false));

    test('works for 2024', () =>
      expect(LeapYearChecker.isLeapYear(2024)).toBe(true));

    test('works for 2400', () =>
      expect(LeapYearChecker.isLeapYear(2400)).toBe(true));
  });
});
