import { it, expect, describe } from 'vitest';

import { Hour, HourFormatters, Minute, Clock } from '../src/clock';

describe('Hour', () => {
  it('not a number validation', () => {
    // @ts-expect-error
    expect(() => new Hour('0')).toThrow('Invalid hour');
  });

  it('too small validation', () => {
    expect(() => new Hour(-1)).toThrow('Invalid hour');
  });

  it('too big validation', () => {
    expect(() => new Hour(24)).toThrow('Invalid hour');
  });

  describe('get', () => {
    it('works for the midnight', () => {
      expect(new Hour(0).get()).toEqual({ raw: 0, formatted: '00' });
    });

    it('works for 23', () => {
      expect(new Hour(23).get()).toEqual({ raw: 23, formatted: '23' });
    });
  });

  describe('equals', () => {
    it('positive', () => {
      expect(new Hour(0).equals(new Hour(0)));
    });

    it('negative', () => {
      expect(new Hour(0).equals(new Hour(1))).toEqual(false);
    });
  });

  describe('isAfter', () => {
    it('positive', () => {
      expect(new Hour(1).isAfter(new Hour(0)));
    });

    it('negative', () => {
      expect(new Hour(0).isAfter(new Hour(1))).toEqual(false);
    });
  });

  describe('isBefore', () => {
    it('positive', () => {
      expect(new Hour(0).isBefore(new Hour(1)));
    });

    it('negative', () => {
      expect(new Hour(1).isBefore(new Hour(0))).toEqual(false);
    });
  });

  it('lists all hours', () => {
    expect(Hour.list().length).toEqual(24);
    expect(Hour.list()[0]).toEqual(new Hour(0));
    expect(Hour.list()[23]).toEqual(new Hour(23));
  });

  it('am_pm formatter', () => {
    expect(new Hour(0, HourFormatters.AM_PM).get().formatted).toEqual('0 a.m.');
    expect(new Hour(12, HourFormatters.AM_PM).get().formatted).toEqual(
      '12 p.m.'
    );
  });

  it('twelve_hours formatter', () => {
    expect(new Hour(0, HourFormatters.TWELVE_HOURS).get().formatted).toEqual(
      '00'
    );
    expect(new Hour(13, HourFormatters.TWELVE_HOURS).get().formatted).toEqual(
      '01'
    );
    expect(new Hour(23, HourFormatters.TWELVE_HOURS).get().formatted).toEqual(
      '11'
    );
  });

  it('twelve_hours_wo_padding formatter', () => {
    expect(
      new Hour(0, HourFormatters.TWELVE_HOURS_WO_PADDING).get().formatted
    ).toEqual('0');

    expect(
      new Hour(13, HourFormatters.TWELVE_HOURS_WO_PADDING).get().formatted
    ).toEqual('1');

    expect(
      new Hour(23, HourFormatters.TWELVE_HOURS_WO_PADDING).get().formatted
    ).toEqual('11');
  });
});

describe('Minute', () => {
  it('not a number validation', () => {
    // @ts-expect-error
    expect(() => new Minute('0')).toThrow('Invalid minute');
  });

  it('too small validation', () => {
    expect(() => new Minute(-1)).toThrow('Invalid minute');
  });

  it('too big validation', () => {
    expect(() => new Minute(60)).toThrow('Invalid minute');
  });

  describe('get', () => {
    it('works for 0', () => {
      expect(new Minute(0).get()).toEqual({ raw: 0, formatted: '00' });
    });

    it('works for 59', () => {
      expect(new Minute(59).get()).toEqual({ raw: 59, formatted: '59' });
    });
  });

  describe('equals', () => {
    it('positive', () => {
      expect(new Minute(0).equals(new Minute(0)));
    });

    it('negative', () => {
      expect(new Minute(0).equals(new Minute(1))).toEqual(false);
    });
  });

  describe('isAfter', () => {
    it('positive', () => {
      expect(new Minute(1).isAfter(new Minute(0)));
    });

    it('negative', () => {
      expect(new Minute(0).isAfter(new Minute(1))).toEqual(false);
    });
  });

  describe('isBefore', () => {
    it('positive', () => {
      expect(new Minute(0).isBefore(new Minute(1)));
    });

    it('negative', () => {
      expect(new Minute(1).isBefore(new Minute(0))).toEqual(false);
    });
  });

  it('lists all moinutes', () => {
    expect(Minute.list().length).toEqual(60);
    expect(Minute.list()[0]).toEqual(new Minute(0));
    expect(Minute.list()[59]).toEqual(new Minute(59));
  });
});

describe('Clock', () => {
  describe('get', () => {
    it('works for midnight', () => {
      expect(new Clock(new Hour(0), new Minute(0)).get()).toEqual({
        raw: { hour: 0, minute: 0 },
        formatted: '00:00',
      });
    });

    it('works for the end of the day', () => {
      expect(new Clock(new Hour(23), new Minute(59)).get()).toEqual({
        raw: { hour: 23, minute: 59 },
        formatted: '23:59',
      });
    });
  });

  describe('equals', () => {
    it('positive', () => {
      const midnight = new Clock(new Hour(0), new Minute(0));
      expect(midnight.equals(midnight)).toEqual(true);
    });

    it('negative', () => {
      const midnight = new Clock(new Hour(0), new Minute(0));
      const minuteAfterMidnight = new Clock(new Hour(0), new Minute(1));
      expect(midnight.equals(minuteAfterMidnight)).toEqual(false);
    });
  });

  describe('isAfter', () => {
    it('positive', () => {
      const midnight = new Clock(new Hour(0), new Minute(0));
      const noon = new Clock(new Hour(12), new Minute(0));

      expect(noon.isAfter(midnight)).toEqual(true);
    });

    it('positive - equal hours', () => {
      const noon = new Clock(new Hour(12), new Minute(0));
      const noonAndMinute = new Clock(new Hour(12), new Minute(1));

      expect(noonAndMinute.isAfter(noon)).toEqual(true);
    });

    it('negative', () => {
      const midnight = new Clock(new Hour(0), new Minute(0));
      const noon = new Clock(new Hour(12), new Minute(0));

      expect(midnight.isAfter(noon)).toEqual(false);
    });

    it('negative - equal hours', () => {
      const midnight = new Clock(new Hour(0), new Minute(0));
      const midnightAndMinute = new Clock(new Hour(0), new Minute(1));

      expect(midnight.isAfter(midnightAndMinute)).toEqual(false);
    });

    it('negative - equal hours and minutes', () => {
      const midnight = new Clock(new Hour(0), new Minute(0));

      expect(midnight.isAfter(midnight)).toEqual(false);
    });
  });

  describe('isBefore', () => {
    it('positive', () => {
      const midnight = new Clock(new Hour(0), new Minute(0));
      const noon = new Clock(new Hour(12), new Minute(0));

      expect(midnight.isBefore(noon)).toEqual(true);
    });

    it('negative', () => {
      const midnight = new Clock(new Hour(0), new Minute(0));
      const noon = new Clock(new Hour(12), new Minute(0));

      expect(noon.isBefore(midnight)).toEqual(false);
    });
  });
});
