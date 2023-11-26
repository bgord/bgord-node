import { Mean } from './mean';
import { PopulationStandardDeviation } from './population-standard-deviation';
import { RoundingStrategy, RoundToDecimal } from './rounding';

export class ZScore {
  private readonly mean: number;
  private readonly standardDeviation: number;

  constructor(
    values: number[],
    private readonly rounding: RoundingStrategy = new RoundToDecimal(2)
  ) {
    if (values.length < 2) {
      throw new Error('At least two values are needed');
    }

    this.mean = Mean.calculate(values);
    this.standardDeviation = PopulationStandardDeviation.calculate(values);
  }

  calculate(value: number): number {
    return this.rounding.round((value - this.mean) / this.standardDeviation);
  }
}
