import { format, formatDistanceToNow } from 'date-fns';
import type {Falsy} from "./types";

export type FormattedDateType = string;

export type DateFormattersInputType = Parameters<typeof format>[0];

export class DateFormatters {
  static datetime(date: DateFormattersInputType): FormattedDateType {
    return format(date, 'yyyy/MM/dd hh:mm');
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
  static truthy(timestamp: ComplexDateInputType): ComplexDateType {
    return ComplexDate._format(timestamp);
  }

  static falsy(timestamp: Falsy<ComplexDateInputType>): ComplexDateType | null {
    if (!timestamp) return null;

    return ComplexDate._format(timestamp);
  }

  private static _format(timestamp: ComplexDateInputType) {
    return {
      raw: timestamp,
      relative: DateFormatters.relative(timestamp),
    };
  }
}
