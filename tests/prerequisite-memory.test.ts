import { describe, test, expect, vi } from 'vitest';

import { Size, SizeUnit } from '../src/size';
import { MemoryConsumption } from '../src/memory-consumption';
import { PrerequisiteStatusEnum } from '../src/prerequisites';
import { PrerequisiteMemory } from '../src/prerequisites/memory';

describe('PrerequisiteMemory class', () => {
  test('verify method returns success for valid memory consumption', async () => {
    const mockGetMemoryConsumption = vi
      .spyOn(MemoryConsumption, 'get')
      .mockReturnValue(new Size({ value: 512, unit: SizeUnit.b }));

    const result = await new PrerequisiteMemory({
      label: 'memory',
      maximum: new Size({ value: 1024, unit: SizeUnit.b }),
    }).verify();

    expect(result).toBe(PrerequisiteStatusEnum.success);

    mockGetMemoryConsumption.mockRestore();
  });

  test('verify method returns failure for invalid memory consumption', async () => {
    const mockGetMemoryConsumption = vi
      .spyOn(MemoryConsumption, 'get')
      .mockReturnValue(new Size({ value: 1024, unit: SizeUnit.b }));

    const result = await new PrerequisiteMemory({
      label: 'memory',
      maximum: new Size({ value: 512, unit: SizeUnit.b }),
    }).verify();

    expect(result).toBe(PrerequisiteStatusEnum.failure);

    mockGetMemoryConsumption.mockRestore();
  });

  test('verify method returns success for exactly equal memory consumption', async () => {
    const mockGetMemoryConsumption = vi
      .spyOn(MemoryConsumption, 'get')
      .mockReturnValue(new Size({ value: 512, unit: SizeUnit.b }));

    const result = await new PrerequisiteMemory({
      label: 'memory',
      maximum: new Size({ value: 512, unit: SizeUnit.b }),
    }).verify();

    expect(result).toBe(PrerequisiteStatusEnum.success);

    mockGetMemoryConsumption.mockRestore();
  });
});
