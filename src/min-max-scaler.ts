import { RoundToDecimal, RoundingStrategy } from './rounding';

type MinMaxScalerValueType = number;

type MinMaxScalerConfigType = {
  min: MinMaxScalerValueType;
  max: MinMaxScalerValueType;
  bound?: {
    lower: MinMaxScalerValueType;
    upper: MinMaxScalerValueType;
  };
  rounding?: RoundingStrategy;
};

export class MinMaxScaler {
  private readonly min: MinMaxScalerValueType;
  private readonly max: MinMaxScalerValueType;
  private readonly lower: MinMaxScalerValueType;
  private readonly upper: MinMaxScalerValueType;

  private readonly rounding: RoundingStrategy;

  constructor(config: MinMaxScalerConfigType) {
    const rounding = config.rounding ?? new RoundToDecimal(2);

    const lower = config.bound?.lower ?? 0;
    const upper = config.bound?.upper ?? 1;

    if (config.max - config.min < 0) {
      throw new Error('Invalid MinMaxScaler min-max config');
    }

    if (upper - lower <= 0) {
      throw new Error('Invalid MinMaxScaler bound config');
    }

    this.rounding = rounding;

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

    if (min === max)
      return {
        original: value,
        scaled: (lower + upper) / 2,
        isMin: value === min,
        isMax: value === max,
      };

    const result = ((value - min) / (max - min)) * (upper - lower) + lower;

    return {
      original: value,
      scaled: this.rounding.round(result),
      isMin: value === min,
      isMax: value === max,
    };
  }

  descale(scaled: MinMaxScalerValueType) {
    const { min, max, lower, upper } = this;

    if (scaled < lower || scaled > upper) {
      throw new Error('Scaled value out of bounds');
    }

    const result = ((scaled - lower) / (upper - lower)) * (max - min) + min;

    return {
      original: this.rounding.round(result),
      scaled,
      isLowerBound: scaled === lower,
      isUpperBound: scaled === upper,
    };
  }

  static getMinMax(values: MinMaxScalerValueType[]) {
    if (values.length === 0) {
      throw new Error('An empty array supplied');
    }

    return { min: Math.min(...values), max: Math.max(...values) };
  }
}
