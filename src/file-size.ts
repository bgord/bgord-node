import { z } from 'zod';

import { FileSizeInBytesType } from './schema';

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

  private bytes: FileSizeInBytesType;

  constructor(config: FileSizeConfigType) {
    this.unit = config.unit;
    this.value = FileSizeValue.parse(config.value);
    this.bytes = this.calculateBytes(config);
  }

  public toString(): string {
    return `${this.value} ${this.unit}`;
  }

  public toBytes(): FileSizeInBytesType {
    return this.bytes;
  }

  static toBytes(config: FileSizeConfigType): FileSizeInBytesType {
    return new FileSize(config).toBytes();
  }

  static unit = FileSizeUnit;

  private calculateBytes(config: FileSizeConfigType): FileSizeInBytesType {
    switch (config.unit) {
      case FileSizeUnit.KB:
        return config.value * 1_000;
      case FileSizeUnit.MB:
        return config.value * 1_000_000;
      default:
        // FileSizeUnit.bytes
        return config.value;
    }
  }
}
