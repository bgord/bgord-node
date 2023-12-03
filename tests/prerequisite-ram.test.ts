import os from 'os';
import { describe, test, expect, vi } from 'vitest';

import { Size, SizeUnit } from '../src/size';
import {
  PrerequisiteStatusEnum,
  PrerequisiteStrategyEnum,
} from '../src/prerequisites';
import {
  PrerequisiteRAMStrategyConfigType,
  PrerequisiteRAMVerificator,
} from '../src/prerequisites/ram';

describe('PrerequisiteRAMVerificator class', () => {
  test('verify method returns success for valid RAM', async () => {
    const spy = vi
      .spyOn(os, 'freemem')
      .mockReturnValue(new Size({ unit: SizeUnit.GB, value: 1 }).toBytes());

    const validConfig: PrerequisiteRAMStrategyConfigType = {
      label: 'Valid RAM',
      strategy: PrerequisiteStrategyEnum.RAM,
      minimum: new Size({ value: 512, unit: SizeUnit.MB }),
    };

    const result = await PrerequisiteRAMVerificator.verify(validConfig);

    expect(result).toBe(PrerequisiteStatusEnum.success);

    spy.mockRestore();
  });

  test('verify method returns failure for insufficient RAM', async () => {
    const spy = vi
      .spyOn(os, 'freemem')
      .mockReturnValue(new Size({ value: 256, unit: SizeUnit.MB }).toBytes());

    const invalidConfig: PrerequisiteRAMStrategyConfigType = {
      label: 'Invalid RAM',
      strategy: PrerequisiteStrategyEnum.RAM,
      minimum: new Size({ value: 512, unit: SizeUnit.MB }),
    };

    const result = await PrerequisiteRAMVerificator.verify(invalidConfig);

    expect(result).toBe(PrerequisiteStatusEnum.failure);

    spy.mockRestore();
  });
});
