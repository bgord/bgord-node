export function Days(value: number) {
  return {
    value,
    hours: value * 24,
    minutes: value * 24 * 60,
    seconds: value * 24 * 60 * 60,
    ms: value * 24 * 60 * 60 * 1000,
  };
}

export function Hours(value: number) {
  return {
    days: round(value / 24),
    value,
    minutes: value * 60,
    seconds: value * 60 * 60,
    ms: value * 60 * 60 * 1000,
  };
}

export function Minutes(value: number) {
  return {
    days: round(value / 60 / 24),
    hours: round(value / 60),
    value,
    seconds: value * 60,
    ms: value * 60 * 1000,
  };
}

export function Seconds(value: number) {
  return {
    days: round(value / 60 / 60 / 24),
    hours: round(value / 60 / 60),
    minutes: round(value / 60),
    value,
    ms: value * 1000,
  };
}

export const Time = { Days, Hours, Minutes, Seconds };

function round(value: number): number {
  return parseFloat(value.toFixed(2));
}
