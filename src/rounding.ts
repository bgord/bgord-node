export abstract class RoundingStrategy {
  abstract round(value: number): number;
}

export class RoundToNearest extends RoundingStrategy {
  round(value: number): number {
    return Math.round(value);
  }
}

export class RoundUp extends RoundingStrategy {
  round(value: number): number {
    return Math.ceil(value);
  }
}

export class RoundDown extends RoundingStrategy {
  round(value: number): number {
    return Math.floor(value);
  }
}

export class RoundToDecimal extends RoundingStrategy {
  constructor(private readonly decimals: number) {
    super();
  }

  round(value: number): number {
    return parseFloat(value.toFixed(this.decimals));
  }
}
