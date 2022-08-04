export function Days(value: number) {
  return {
    toHours() {
      return value * 24;
    },
    toMinutes() {
      return value * 24 * 60;
    },
    toSeconds() {
      return value * 24 * 60 * 60;
    },
    toMs() {
      return value * 24 * 60 * 60 * 1000;
    },
  };
}

export function Hours(value: number) {
  return {
    toMinutes() {
      return value * 60;
    },
    toSeconds() {
      return value * 60 * 60;
    },
    toMs() {
      return value * 60 * 60 * 1000;
    },
  };
}

export function Minutes(value: number) {
  return {
    toSeconds() {
      return value * 60;
    },
    toMs() {
      return value * 60 * 1000;
    },
  };
}

export function Seconds(value: number) {
  return {
    toMs() {
      return value * 1000;
    },
  };
}

export const Time = { Days, Hours, Minutes, Seconds };
