export class Sum {
  static of(values: number[]): number {
    return values.reduce((sum, x) => sum + x, 0);
  }
}
