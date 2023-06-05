type MinMaxScalerValueType = number;

type MinMaxScalerConfigType = {
  min: MinMaxScalerValueType;
  max: MinMaxScalerValueType;
  bound?: {
    lower: MinMaxScalerValueType;
    upper: MinMaxScalerValueType;
  };
};

export class MinMaxScaler {
  private min: MinMaxScalerValueType;
  private max: MinMaxScalerValueType;
  private lower: MinMaxScalerValueType;
  private upper: MinMaxScalerValueType;

  constructor(config: MinMaxScalerConfigType) {
    const lower = config.bound?.lower ?? 0;
    const upper = config.bound?.upper ?? 1;

    if (config.max - config.min < 0) {
      throw new Error('Invalid MinMaxScaler min-max config');
    }

    if (upper - lower <= 0) {
      throw new Error('Invalid MinMaxScaler bound config');
    }

    this.min = config.min;
    this.max = config.max;
    this.lower = lower;
    this.upper = upper;
  }

  scale(value: MinMaxScalerValueType) {
    const { min, max, lower, upper } = this;

    if (value < min || value > max) {
      throw new Error('Value out of min/max range');
    }

    if (min === max) return (lower + upper) / 2;

    const result = ((value - min) / (max - min)) * (upper - lower) + lower;

    return Number(result.toFixed(2));
  }

  static getMinMax(values: MinMaxScalerValueType[]) {
    if (values.length === 0) {
      throw new Error('An empty array supplied');
    }

    return { min: Math.min(...values), max: Math.max(...values) };
  }
}
