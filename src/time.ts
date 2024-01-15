import { RoundToDecimal } from './rounding';

const rounding = new RoundToDecimal(2);

type TimeResultType = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  ms: number;
};

export class Time {
  static Days(value: number): TimeResultType {
    return {
      days: value,
      hours: value * 24,
      minutes: value * 24 * 60,
      seconds: value * 24 * 60 * 60,
      ms: value * 24 * 60 * 60 * 1000,
    };
  }

  static Hours(value: number): TimeResultType {
    return {
      days: rounding.round(value / 24),
      hours: value,
      minutes: value * 60,
      seconds: value * 60 * 60,
      ms: value * 60 * 60 * 1000,
    };
  }

  static Minutes(value: number): TimeResultType {
    return {
      days: rounding.round(value / 60 / 24),
      hours: rounding.round(value / 60),
      minutes: value,
      seconds: value * 60,
      ms: value * 60 * 1000,
    };
  }

  static Seconds(value: number): TimeResultType {
    return {
      days: rounding.round(value / 60 / 60 / 24),
      hours: rounding.round(value / 60 / 60),
      minutes: rounding.round(value / 60),
      seconds: value,
      ms: value * 1000,
    };
  }

  static Ms(value: number): TimeResultType {
    return {
      days: rounding.round(value / 1000 / 60 / 60 / 24),
      hours: rounding.round(value / 1000 / 60 / 60),
      minutes: rounding.round(value / 1000 / 60),
      seconds: rounding.round(value / 1000),
      ms: value,
    };
  }
}
