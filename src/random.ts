type RandomGenerateConfigType = {
  min: number;
  max: number;
};

export class Random {
  static generate(config?: RandomGenerateConfigType) {
    const min = config?.min ?? 0;
    const max = config?.max ?? 1;

    if (!Number.isInteger(min)) {
      throw new Error('Minimum value is not an integer');
    }

    if (!Number.isInteger(max)) {
      throw new Error('Maximum value is not an integer');
    }

    if (min === max) {
      throw new Error('Minimum and maximum values cannot be equal');
    }

    if (min > max) {
      throw new Error('Minimum value cannot be greater than maximum value');
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
