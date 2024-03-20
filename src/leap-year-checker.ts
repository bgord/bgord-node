export class LeapYearChecker {
  static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  static isCurrentYearLeapYear(): boolean {
    const year = new Date().getFullYear();

    return LeapYearChecker.isLeapYear(year);
  }
}
