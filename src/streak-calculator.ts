import { format, subDays, isAfter, isEqual } from 'date-fns';

type DateType = string;

export type StreakType = {
  cutoff: DateType;
  dates: DateType[];
  streak: number;
};

export class StreakCalculator {
  private readonly cutoff: DateType;

  constructor() {
    const today = new Date();
    this.cutoff = StreakCalculator.format(today);
  }

  calculate(_dates: DateType[]): StreakType {
    const dates = Array.from(new Set(_dates));

    let streak = 0;
    let streakTail = this.cutoff;

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i] as string;

      if (isAfter(date, streakTail)) continue;

      if (isEqual(streakTail, date) || isAfter(date, streakTail)) {
        streakTail = StreakCalculator.format(subDays(date, 1));
        streak++;
      } else break;
    }

    return { cutoff: this.cutoff, dates, streak };
  }

  static format(date: Parameters<typeof format>[0]): DateType {
    return format(date, 'yyyy-MM-dd');
  }
}
