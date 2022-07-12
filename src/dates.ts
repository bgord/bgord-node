import { format, formatDistanceToNow } from 'date-fns';

export type FormattedDateType = string;

type DateType = Parameters<typeof format>[0];

export class DateFormatters {
  static datetime(date: DateType): FormattedDateType {
    return format(date, 'yyyy/MM/dd hh:mm');
  }

  static relative(date: DateType) {
    return formatDistanceToNow(date, { addSuffix: true });
  }
}
