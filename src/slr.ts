import { RoundToNearest, RoundingStrategy } from './rounding';

export class Sum {
  static of(values: number[]): number {
    return values.reduce((sum, x) => sum + x, 0);
  }
}

export class SLR {
  private readonly rounding: RoundingStrategy = new RoundToNearest();

  constructor(
    private readonly params: { a: number; b: number },
    rounding?: RoundingStrategy
  ) {
    this.rounding = rounding ?? this.rounding;
  }

  static fromPairs(
    pairs: { x: number; y: number }[],
    rounding?: RoundingStrategy
  ) {
    const x = pairs.map(pair => pair.x);
    const y = pairs.map(pair => pair.y);
    const xx = x.map(x => Math.pow(x, 2));
    const xy = pairs.map(pair => pair.x * pair.y);

    const n = pairs.length;

    const sX = Sum.of(x);
    const sY = Sum.of(y);
    const sSX = Sum.of(xx);
    const sXY = Sum.of(xy);

    const b = (sXY - (sX * sY) / n) / (sSX - Math.pow(sX, 2) / n);
    const a = (sY - b * sX) / n;

    return new SLR({ a, b }, rounding);
  }

  predict(x: number, strategy?: RoundingStrategy): number {
    const rounding = strategy ?? this.rounding;
    const prediction = this.params.b * x + this.params.a;

    return rounding.round(prediction);
  }

  inspect(): SLR['params'] {
    return this.params;
  }
}
