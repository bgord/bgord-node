import { Size, SizeUnit } from './size';

export type MemoryConsumptionResultType = Size;

export class MemoryConsumption {
  static get(): MemoryConsumptionResultType {
    const memoryConsumption = process.memoryUsage().rss;

    return new Size({ value: memoryConsumption, unit: SizeUnit.b });
  }
}
