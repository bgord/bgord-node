import { Size, SizeUnit } from './size';

export type MemoryConsumptionResultType = ReturnType<Size['format']>;

export class MemoryConsumption {
  static get(): MemoryConsumptionResultType {
    const memoryConsumption = process.memoryUsage().rss;

    return new Size({
      value: memoryConsumption,
      unit: SizeUnit.b,
    }).format(SizeUnit.MB);
  }
}
