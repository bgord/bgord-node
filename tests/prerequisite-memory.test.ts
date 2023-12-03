import { describe, test, expect, vi } from 'vitest';

import { Size, SizeUnit } from '../src/size';
import { MemoryConsumption } from '../src/memory-consumption';
import {
  PrerequisiteStatusEnum,
  PrerequisiteStrategyEnum,
} from '../src/prerequisites';
import {
  PrerequisiteMemoryStrategyConfigType,
  PrerequisiteMemoryVerificator,
} from '../src/prerequisites/memory';

describe('PrerequisiteMemoryVerificator class', () => {
  test('verify method returns success for valid memory consumption', async () => {
    const validConfig: PrerequisiteMemoryStrategyConfigType = {
      label: 'Valid Memory',
      strategy: PrerequisiteStrategyEnum.memory,
      maximum: new Size({ value: 1024, unit: SizeUnit.b }),
    };

    // Mock MemoryConsumption.get() to return a size less than the maximum
    const mockGetMemoryConsumption = vi
      .spyOn(MemoryConsumption, 'get')
      .mockReturnValue(new Size({ value: 512, unit: SizeUnit.b }));

    const result = await PrerequisiteMemoryVerificator.verify(validConfig);

    expect(result).toBe(PrerequisiteStatusEnum.success);

    mockGetMemoryConsumption.mockRestore();
  });

  test('verify method returns failure for invalid memory consumption', async () => {
    const invalidConfig: PrerequisiteMemoryStrategyConfigType = {
      label: 'Invalid Memory',
      strategy: PrerequisiteStrategyEnum.memory,
      maximum: new Size({ value: 512, unit: SizeUnit.b }),
    };

    // Mock MemoryConsumption.get() to return a size greater than the maximum
    const mockGetMemoryConsumption = vi
      .spyOn(MemoryConsumption, 'get')
      .mockReturnValue(new Size({ value: 1024, unit: SizeUnit.b }));

    const result = await PrerequisiteMemoryVerificator.verify(invalidConfig);

    expect(result).toBe(PrerequisiteStatusEnum.failure);

    mockGetMemoryConsumption.mockRestore();
  });

  test('verify method returns success for exactly equal memory consumption', async () => {
    const equalConfig: PrerequisiteMemoryStrategyConfigType = {
      label: 'Equal Memory',
      strategy: PrerequisiteStrategyEnum.memory,
      maximum: new Size({ value: 512, unit: SizeUnit.b }),
    };

    // Mock MemoryConsumption.get() to return a size exactly equal to the maximum
    const mockGetMemoryConsumption = vi
      .spyOn(MemoryConsumption, 'get')
      .mockReturnValue(new Size({ value: 512, unit: SizeUnit.b }));

    const result = await PrerequisiteMemoryVerificator.verify(equalConfig);

    expect(result).toBe(PrerequisiteStatusEnum.success);

    mockGetMemoryConsumption.mockRestore();
  });
});
