import { ZScore } from './z-score';

export class OutlierDetector {
  private readonly zScore: ZScore;

  private readonly threshold: number;

  constructor(values: number[], threshold: number) {
    if (values.length < 2) {
      throw new Error('At least two values are needed');
    }

    this.zScore = new ZScore(values);
    this.threshold = Math.abs(threshold);
  }

  check(value: number): boolean {
    return this.zScore.calculate(value) <= this.threshold;
  }
}
