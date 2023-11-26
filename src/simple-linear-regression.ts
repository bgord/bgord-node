import { RoundToNearest, RoundingStrategy } from './rounding';
import { Sum } from './sum';

export type SLRPairType = { x: number; y: number };

export type SLRParamsType = { a: number; b: number };

export type SLRPredictionType = number;

export class SimpleLinearRegression {
  private readonly rounding: RoundingStrategy = new RoundToNearest();

  constructor(
    private readonly params: SLRParamsType,
    rounding?: RoundingStrategy
  ) {
    this.rounding = rounding ?? this.rounding;
  }

  static fromPairs(pairs: SLRPairType[], rounding?: RoundingStrategy) {
    const n = pairs.length;

    if (n < 2) {
      throw new Error('At least two pairs needed');
    }

    const x = pairs.map(pair => pair.x);
    const y = pairs.map(pair => pair.y);
    const xx = x.map(x => Math.pow(x, 2));
    const xy = pairs.map(pair => pair.x * pair.y);

    const sX = Sum.of(x);
    if (sX >= Number.MAX_SAFE_INTEGER) {
      throw new Error('Sum of x values is too big');
    }

    const sY = Sum.of(y);
    if (sY >= Number.MAX_SAFE_INTEGER) {
      throw new Error('Sum of y values is too big');
    }

    const sSX = Sum.of(xx);
    if (sSX >= Number.MAX_SAFE_INTEGER) {
      throw new Error('Sum of x squared values is too big');
    }

    const sXY = Sum.of(xy);
    if (sXY >= Number.MAX_SAFE_INTEGER) {
      throw new Error('Sum of x times y values is too big');
    }

    const bDenominator = sSX - Math.pow(sX, 2) / n;

    if (bDenominator === 0) {
      throw new Error('Unable to create the model');
    }

    const b = (sXY - (sX * sY) / n) / bDenominator;
    const a = (sY - b * sX) / n;

    return new SimpleLinearRegression({ a, b }, rounding);
  }

  predict(x: SLRPairType['x'], strategy?: RoundingStrategy): SLRPredictionType {
    const rounding = strategy ?? this.rounding;
    const prediction = this.params.b * x + this.params.a;

    return rounding.round(prediction);
  }

  inspect(): SimpleLinearRegression['params'] {
    return this.params;
  }
}
