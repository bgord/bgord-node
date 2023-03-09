import { z } from 'zod';

import * as Schema from './schema';

export enum FileSizeUnit {
  'byte' = 'byte',
  'KB' = 'KB',
  'MB' = 'MB',
}

const FileSizeValue = z.number().positive();
export type FileSizeValueType = z.infer<typeof FileSizeValue>;

export type FileSizeConfigType = {
  unit: FileSizeUnit;
  value: FileSizeValueType;
};

export class FileSize {
  private unit: FileSizeUnit;

  private value: FileSizeValueType;

  private bytes: Schema.SizeInBytesType;

  constructor(config: FileSizeConfigType) {
    this.unit = config.unit;
    this.value = FileSizeValue.parse(config.value);
    this.bytes = this.calculateBytes(config);
  }

  public toString(): string {
    return `${this.value} ${this.unit}`;
  }

  public toBytes(): Schema.SizeInBytesType {
    return this.bytes;
  }

  static toBytes(config: FileSizeConfigType): Schema.SizeInBytesType {
    return new FileSize(config).toBytes();
  }

  static unit = FileSizeUnit;

  private calculateBytes(config: FileSizeConfigType): Schema.SizeInBytesType {
    switch (config.unit) {
      case FileSizeUnit.KB:
        return Schema.SizeInBytes.parse(config.value * 1024);
      case FileSizeUnit.MB:
        return Schema.SizeInBytes.parse(config.value * 1024 * 1024);
      default:
        // FileSizeUnit.bytes
        return Schema.SizeInBytes.parse(config.value);
    }
  }
}
