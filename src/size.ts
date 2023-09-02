import { z } from 'zod';

import * as Schema from './schema';
import { Approximation } from './approximation';

export enum SizeUnit {
  b = 'b',
  KB = 'KB',
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
  private unit: SizeUnit;

  private value: SizeValueType;

  private bytes: Schema.SizeInBytesType;

  constructor(config: SizeConfigType) {
    this.unit = config.unit;
    this.value = SizeValue.parse(config.value);
    this.bytes = this.calculateBytes(config);
  }

  public toString(): string {
    return `${this.value} ${this.unit}`;
  }

  public toBytes(): Schema.SizeInBytesType {
    return this.bytes;
  }

  public isGreaterThan(another: Size) {
    return this.bytes > another.toBytes();
  }

  public format(unit: SizeUnit): string {
    switch (unit) {
      case SizeUnit.KB:
        return `${Approximation.float(this.bytes / 1024)} ${SizeUnit.KB}`;
      case SizeUnit.MB:
        return `${Approximation.float(this.bytes / 1024 / 1024)} ${
          SizeUnit.MB
        }`;
      case SizeUnit.GB:
        return `${Approximation.float(this.bytes / 1024 / 1024 / 1024)} ${
          SizeUnit.GB
        }`;
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
      case SizeUnit.KB:
        return Schema.SizeInBytes.parse(config.value * 1024);
      case SizeUnit.MB:
        return Schema.SizeInBytes.parse(config.value * 1024 * 1024);
      case SizeUnit.GB:
        return Schema.SizeInBytes.parse(config.value * 1024 * 1024 * 1024);
      default:
        // SizeUnit.b
        return Schema.SizeInBytes.parse(config.value);
    }
  }
}
