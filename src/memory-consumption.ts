import { Size, SizeUnit } from './size';

export class MemoryConsumption {
  static get(): Size {
    const memoryConsumption = process.memoryUsage().rss;

    return new Size({ value: memoryConsumption, unit: SizeUnit.b });
  }
}
