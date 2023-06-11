import { format, formatDistanceToNow } from 'date-fns';
import type {Falsy} from "./ts-utils";

export type FormattedDateType = string;

export type DateFormattersInputType = Parameters<typeof format>[0];

export class DateFormatters {
  static datetime(date: DateFormattersInputType): FormattedDateType {
    return format(date, 'yyyy/MM/dd hh:mm');
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

export type ComplexDateType = {
  raw: number;
  relative: string;
};

export type ComplexDateInputType = number;

export class ComplexDate {
  static truthy(timestampMs: ComplexDateInputType): ComplexDateType {
    return ComplexDate._format(timestampMs);
  }

  static falsy(timestampMs: Falsy<ComplexDateInputType>): ComplexDateType | null {
    if (!timestampMs) return null;

    return ComplexDate._format(timestampMs);
  }

  private static _format(timestampMs: ComplexDateInputType) {
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
