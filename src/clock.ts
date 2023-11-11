export type HourFormatter = (value: Hour['value']) => string;

export const HourFormatters = {
  TWENTY_FOUR_HOURS: value => value.toString().padStart(2, '0'),

  AM_PM: value => {
    if (value < 12) return `${value.toString()} a.m.`;
    return `${value.toString()} p.m.`;
  },

  TWELVE_HOURS: value => (value % 12).toString().padStart(2, '0'),

  TWELVE_HOURS_WO_PADDING: value => (value % 12).toString(),
} satisfies Record<string, HourFormatter>;

export class Hour {
  private readonly value: number;

  private readonly formatter: HourFormatter;

  static readonly ZERO = new Hour(0);

  static readonly MAX = new Hour(23);

  constructor(candidate: number, formatter?: HourFormatter) {
    if (!Number.isInteger(candidate)) {
      throw new Error('Invalid hour');
    }
    if (candidate < 0) {
      throw new Error('Invalid hour');
    }
    if (candidate >= 24) {
      throw new Error('Invalid hour');
    }

    this.value = candidate;
    this.formatter = formatter ?? HourFormatters.TWENTY_FOUR_HOURS;
  }

  get(formatter?: HourFormatter) {
    const format = formatter ?? this.formatter;

    return { raw: this.value, formatted: format(this.value) };
  }

  equals(another: Hour): boolean {
    return this.value === another.get().raw;
  }

  isAfter(another: Hour): boolean {
    return this.value > another.get().raw;
  }

  isBefore(another: Hour): boolean {
    return this.value < another.get().raw;
  }

  static list(formatter?: HourFormatter) {
    return Array.from({ length: 24 }).map(
      (_, index) => new Hour(index, formatter)
    );
  }
}

export class Minute {
  private readonly value: number;

  static readonly ZERO = new Minute(0);

  static readonly MAX = new Minute(59);

  constructor(candidate: number) {
    if (!Number.isInteger(candidate)) {
      throw new Error('Invalid minute');
    }

    if (candidate < 0) {
      throw new Error('Invalid minute');
    }

    if (candidate >= 60) {
      throw new Error('Invalid minute');
    }

    this.value = candidate;
  }

  get() {
    return { raw: this.value, formatted: this.value.toString().padStart(2, '0') };
  }

  equals(another: Minute): boolean {
    return this.value === another.get().raw;
  }

  isAfter(another: Minute): boolean {
    return this.value > another.get().raw;
  }

  isBefore(another: Minute): boolean {
    return this.value < another.get().raw;
  }

  static list() {
    return Array.from({ length: 60 }).map((_, index) => new Minute(index));
  }
}

export type ClockFormatter = (hour: Hour, minute: Minute) => string;

export const ClockFormatters = {
  TWENTY_FOUR_HOURS: (hour, minute) =>
    `${hour.get().formatted}:${minute.get().formatted}`,
} satisfies Record<string, ClockFormatter>;

export class Clock {
  private readonly formatter: ClockFormatter;

  constructor(
    private readonly hour: Hour,
    private readonly minute: Minute,
    formatter?: ClockFormatter
  ) {
    this.formatter = formatter ?? ClockFormatters.TWENTY_FOUR_HOURS;
  }

  get(formatter?: ClockFormatter) {
    const format = formatter ?? this.formatter;

    return {
      raw: { hour: this.hour.get().raw, minute: this.minute.get().raw },
      formatted: format(this.hour, this.minute),
    };
  }

  equals(another: Clock): boolean {
    return (
      this.hour.get().raw === another.get().raw.hour &&
      this.minute.get().raw === another.get().raw.minute
    );
  }

  isAfter(another: Clock): boolean {
    if (this.hour.get().raw > another.hour.get().raw) {
      return true;
    }

    if (
      this.hour.get().raw === another.hour.get().raw &&
      this.minute.get().raw > another.minute.get().raw
    ) {
      return true;
    }

    return false;
  }

  isBefore(another: Clock): boolean {
    if (this.hour.get().raw < another.hour.get().raw) {
      return true;
    }

    if (
      this.hour.get().raw === another.hour.get().raw &&
      this.minute.get().raw < another.minute.get().raw
    ) {
      return true;
    }

    return false;
  }
}
