import { it, expect, describe } from 'vitest';

import { DateCalculator } from '../src/dates';

describe('DateCalculator', () => {
  describe('getStartOfDayTsInTz', () => {
    it('gmt+2', () => {
      // Thu Jun 15 2023 19:11:10 GMT+0000
      // Thu Jun 15 2023 21:11:10 GMT+0200
      const now = 1686857934872;

      // GMT+2
      const timeZoneOffsetMs = -7200000;

      const result = DateCalculator.getStartOfDayTsInTz({
        now,
        timeZoneOffsetMs,
      });

      // Wed Jun 14 2023 22:00:00 GMT+0000
      // Thu Jun 15 2023 00:00:00 GMT+0200
      expect(result).toEqual(1686780000000);
    });

    it('gmt+0', () => {
      // Thu Jun 15 2023 19:11:10 GMT+0000
      const now = 1686857934872;

      // GMT+0
      const timeZoneOffsetMs = 0;

      const result = DateCalculator.getStartOfDayTsInTz({
        now,
        timeZoneOffsetMs,
      });

      // Thu Jun 15 2023 00:00:00 GMT+0000
      expect(result).toEqual(1686787200000);
    });

    it('gmt+5', () => {
      // Thu Jun 15 2023 19:11:10 GMT+0000
      // Thu Jun 16 2023 00:11:10 GMT+0200
      const now = 1686857934872;

      // GMT+5
      const timeZoneOffsetMs = -18000000;

      const result = DateCalculator.getStartOfDayTsInTz({
        now,
        timeZoneOffsetMs,
      });

      // Thu Jun 15 2023 19:00:00 GMT+0000
      // Thu Jun 16 2023 00:00:00 GMT+0500
      expect(result).toEqual(1686855600000);
    });

    it('gmt-2', () => {
      // Thu Jun 15 2023 00:11:10 GMT+0000
      // Thu Jun 14 2023 22:11:10 GMT-0200
      const now = 1686787860714;

      // GMT-2
      const timeZoneOffsetMs = 7200000;

      const result = DateCalculator.getStartOfDayTsInTz({
        now,
        timeZoneOffsetMs,
      });

      // Wed Jun 14 2023 02:00:00 GMT+0000
      // Wed Jun 14 2023 00:00:00 GMT-0200
      expect(result).toEqual(1686708000000);
    });
  });
});
