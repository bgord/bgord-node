import { Mean } from './mean';
import { Sum } from './sum';
import { RoundToDecimal, RoundingStrategy } from './rounding';

export class PopulationStandardDeviation {
  static calculate(
    values: number[],
    rounding: RoundingStrategy = new RoundToDecimal(2)
  ): number {
    if (values.length < 2) {
      throw new Error('At least two values are needed');
    }

    const mean = Mean.calculate(values);
    const n = values.length;

    const squaredDifferences = values.map(value => Math.pow(value - mean, 2));
    const sumOfSquaredDifferences = Sum.of(squaredDifferences);

    const variance = sumOfSquaredDifferences / n;

    return rounding.round(Math.sqrt(variance));
  }
}
