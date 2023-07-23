import { z } from 'zod';

import * as Schema from './schema';

export enum SizeUnit {
  'byte' = 'byte',
  'KB' = 'KB',
  'MB' = 'MB',
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
      default:
        // SizeUnit.byte
        return Schema.SizeInBytes.parse(config.value);
    }
  }
}
