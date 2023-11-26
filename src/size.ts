import { z } from 'zod';

import * as Schema from './schema';
import { RoundToDecimal } from './rounding';

export enum SizeUnit {
  b = 'b',
  kB = 'kB',
  MB = 'MB',
  GB = 'GB',
}

const SizeValue = z.number().positive();
export type SizeValueType = z.infer<typeof SizeValue>;

export type SizeConfigType = {
  unit: SizeUnit;
  value: SizeValueType;
};

export class Size {
  private readonly unit: SizeUnit;

  private readonly value: SizeValueType;

  private readonly bytes: Schema.SizeInBytesType;

  private static readonly KB_MULTIPLIER = 1024;

  private static readonly MB_MULTIPLIER = 1024 * Size.KB_MULTIPLIER;

  private static readonly GB_MULTIPLIER = 1024 * Size.MB_MULTIPLIER;

  constructor(config: SizeConfigType) {
    this.unit = config.unit;
    this.value = SizeValue.parse(config.value);
    this.bytes = this.calculateBytes(config);
  }

  toString(): string {
    return `${this.value} ${this.unit}`;
  }

  toBytes(): Schema.SizeInBytesType {
    return this.bytes;
  }

  isGreaterThan(another: Size) {
    return this.bytes > another.toBytes();
  }

  format(unit: SizeUnit): string {
    const rounding = new RoundToDecimal(2);

    switch (unit) {
      case SizeUnit.kB:
        const kbs = rounding.round(this.bytes / Size.KB_MULTIPLIER);

        return `${kbs} ${SizeUnit.kB}`;
      case SizeUnit.MB:
        const mbs = rounding.round(this.bytes / Size.MB_MULTIPLIER);

        return `${mbs} ${SizeUnit.MB}`;
      case SizeUnit.GB:
        const gbs = rounding.round(this.bytes / Size.GB_MULTIPLIER);

        return `${gbs} ${SizeUnit.GB}`;
      default:
        // SizeUnit.b
        return `${this.bytes} ${SizeUnit.b}`;
    }
  }

  static toBytes(config: SizeConfigType): Schema.SizeInBytesType {
    return new Size(config).toBytes();
  }

  static unit = SizeUnit;

  private calculateBytes(config: SizeConfigType): Schema.SizeInBytesType {
    switch (config.unit) {
      case SizeUnit.kB:
        return Schema.SizeInBytes.parse(config.value * Size.KB_MULTIPLIER);
      case SizeUnit.MB:
        return Schema.SizeInBytes.parse(config.value * Size.MB_MULTIPLIER);
      case SizeUnit.GB:
        return Schema.SizeInBytes.parse(config.value * Size.GB_MULTIPLIER);
      default:
        // SizeUnit.b
        return Schema.SizeInBytes.parse(config.value);
    }
  }
}
