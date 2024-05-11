import os from 'node:os';
import { describe, test, expect, vi } from 'vitest';

import { Size, SizeUnit } from '../src/size';
import { PrerequisiteStatusEnum } from '../src/prerequisites';
import { PrerequisiteRAM } from '../src/prerequisites/ram';

describe('PrerequisiteRAM class', () => {
  test('verify method returns success for valid RAM', async () => {
    const spy = vi
      .spyOn(os, 'freemem')
      .mockReturnValue(new Size({ unit: SizeUnit.GB, value: 1 }).toBytes());

    const result = await new PrerequisiteRAM({
      label: 'ram',
      minimum: new Size({ value: 512, unit: SizeUnit.MB }),
    }).verify();

    expect(result).toBe(PrerequisiteStatusEnum.success);

    spy.mockRestore();
  });

  test('verify method returns failure for insufficient RAM', async () => {
    const spy = vi
      .spyOn(os, 'freemem')
      .mockReturnValue(new Size({ value: 256, unit: SizeUnit.MB }).toBytes());

    const result = await new PrerequisiteRAM({
      label: 'ram',
      minimum: new Size({ value: 512, unit: SizeUnit.MB }),
    }).verify();

    expect(result).toBe(PrerequisiteStatusEnum.failure);

    spy.mockRestore();
  });
});
