import { Approximation } from './approximation';

export class Time {
  static Days(value: number) {
    return {
      value,
      hours: value * 24,
      minutes: value * 24 * 60,
      seconds: value * 24 * 60 * 60,
      ms: value * 24 * 60 * 60 * 1000,
    };
  }

  static Hours(value: number) {
    return {
      days: Approximation.float(value / 24),
      value,
      minutes: value * 60,
      seconds: value * 60 * 60,
      ms: value * 60 * 60 * 1000,
    };
  }

  static Minutes(value: number) {
    return {
      days: Approximation.float(value / 60 / 24),
      hours: Approximation.float(value / 60),
      value,
      seconds: value * 60,
      ms: value * 60 * 1000,
    };
  }

  static Seconds(value: number) {
    return {
      days: Approximation.float(value / 60 / 60 / 24),
      hours: Approximation.float(value / 60 / 60),
      minutes: Approximation.float(value / 60),
      value,
      ms: value * 1000,
    };
  }
}
