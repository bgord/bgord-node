export class Days {
  value: number;

  constructor(value: number) {
    this.value = value;
  }

  toHours() {
    return this.value * 24;
  }

  toMinutes() {
    return this.value * 24 * 60;
  }

  toSeconds() {
    return this.value * 24 * 60 * 60;
  }

  toMs() {
    return this.value * 24 * 60 * 60 * 1000;
  }
}

export class Hours {
  value: number;

  constructor(value: number) {
    this.value = value;
  }

  toMinutes() {
    return this.value * 60;
  }

  toSeconds() {
    return this.value * 60 * 60;
  }

  toMs() {
    return this.value * 60 * 60 * 1000;
  }
}

export class Minutes {
  value: number;

  constructor(value: number) {
    this.value = value;
  }

  toSeconds() {
    return this.value * 60;
  }

  toMs() {
    return this.value * 60 * 1000;
  }
}

export class Seconds {
  value: number;

  constructor(value: number) {
    this.value = value;
  }

  toMs() {
    return this.value * 1000;
  }
}

export const Time = { Days, Hours, Minutes, Seconds };
