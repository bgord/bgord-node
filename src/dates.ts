import { format } from 'date-fns';

export type FormattedDateType = string;

export class Dates {
  static datetime(date: Date): FormattedDateType {
    return format(date, 'yyyy/MM/dd hh:mm');
  }
}
