import { RoundingStrategy, RoundToNearest } from './rounding';

export class Percentage {
  static of(
    numerator: number,
    denominator: number,
    rounding: RoundingStrategy = new RoundToNearest()
  ): number {
    if (denominator === 0) {
      throw new Error('Invalid denominator');
    }

    if (numerator === 0) return 0;

    return rounding.round((numerator / denominator) * 100);
  }
}
