import { describe, test, expect, vi } from 'vitest';

import { MemoryConsumption } from '../src/memory-consumption';
import { SizeUnit } from '../src/size';

describe('MemoryConsumption class', () => {
  test('get method returns memory consumption size', () => {
    const spy = vi.spyOn(process, 'memoryUsage').mockReturnValue({
      ...process.memoryUsage(),
      rss: 123123123,
    });

    const result = MemoryConsumption.get();

    expect(result.toBytes()).toBe(123123123);
    expect(result.format(SizeUnit.MB)).toBe('117.42 MB');

    spy.mockRestore();
  });
});
