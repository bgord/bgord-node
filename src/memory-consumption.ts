import { Size, SizeUnit } from './size';

export type MemoryConsumptionResultType = {
  raw: ReturnType<typeof process['memoryUsage']['rss']>;
  formatted: ReturnType<typeof Size['toString']>;
};

export class MemoryConsumption {
  static get(): MemoryConsumptionResultType {
    const memoryConsumption = process.memoryUsage().rss;

    const formatted = new Size({
      value: memoryConsumption,
      unit: SizeUnit.b,
    }).toString();

    return { raw: memoryConsumption, formatted };
  }
}
