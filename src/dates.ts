import { format, formatDistanceToNow } from 'date-fns';

import * as Schema from './schema';
import { Time } from './time';
import { Falsy } from './ts-utils';

export type FormattedDateType = string;

export type DateFormattersInputType = Parameters<typeof format>[0];

export class DateFormatters {
  static datetime(date: DateFormattersInputType): FormattedDateType {
    return format(date, 'yyyy/MM/dd HH:mm');
  }

  static date(date: DateFormattersInputType): FormattedDateType {
    return format(date, 'yyyy/MM/dd');
  }

  static monthDay(date: DateFormattersInputType): FormattedDateType {
    return format(date, 'MM/dd');
  }

  static relative(date: DateFormattersInputType) {
    return formatDistanceToNow(date, { addSuffix: true });
  }
}

export type RelativeDateType = {
  raw: number;
  relative: string;
};

export type RelativeDateInputType = number;

export class RelativeDate {
  static to = {
    now: {
      truthy: RelativeDate.truthy,
      falsy: RelativeDate.falsy,
    },
  };

  private static truthy(timestampMs: RelativeDateInputType): RelativeDateType {
    return RelativeDate._format(timestampMs);
  }

  private static falsy(
    timestampMs: Falsy<RelativeDateInputType>
  ): RelativeDateType | null {
    if (!timestampMs) return null;

    return RelativeDate._format(timestampMs);
  }

  private static _format(timestampMs: RelativeDateInputType) {
    return {
      raw: timestampMs,
      relative: DateFormatters.relative(timestampMs),
    };
  }
}

export enum DayOfTheWeekEnum {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 0,
}

type GetStartOfDayTsInTzConfigType = {
  now: Schema.TimestampType;
  timeZoneOffsetMs: Schema.TimeZoneOffsetValueType;
};

export class DateCalculator {
  static getStartOfDayTsInTz(config: GetStartOfDayTsInTzConfigType) {
    const startOfDayUTC = new Date();
    startOfDayUTC.setUTCHours(0, 0, 0, 0);

    const startOfDayInTimeZone =
      startOfDayUTC.getTime() + config.timeZoneOffsetMs;

    const timeSinceNewDayInTimeZoneRelativeToUtcStartOfDay =
      (config.now - startOfDayInTimeZone) % Time.Days(1).ms;

    if (timeSinceNewDayInTimeZoneRelativeToUtcStartOfDay >= Time.Days(1).ms) {
      return (
        config.now -
        timeSinceNewDayInTimeZoneRelativeToUtcStartOfDay +
        Time.Days(1).ms
      );
    }

    if (timeSinceNewDayInTimeZoneRelativeToUtcStartOfDay >= 0) {
      return config.now - timeSinceNewDayInTimeZoneRelativeToUtcStartOfDay;
    }

    return (
      config.now -
      timeSinceNewDayInTimeZoneRelativeToUtcStartOfDay -
      Time.Days(1).ms
    );
  }
}
