import { format } from 'date-fns';

export type FormattedDateType = string;

type DateType = Parameters<typeof format>[0];

export class DateFormatters {
  static datetime(date: DateType): FormattedDateType {
    return format(date, 'yyyy/MM/dd hh:mm');
  }
}
