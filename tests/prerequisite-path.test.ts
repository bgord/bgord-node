import fsp from 'fs/promises';
import { describe, test, expect, vi } from 'vitest';
import {
  PrerequisiteStatusEnum,
  PrerequisiteStrategyEnum,
} from '../src/prerequisites';
import {
  PrerequisitePathStrategyConfigType,
  PrerequisitePathVerificator,
} from '../src/prerequisites/path';

describe('PrerequisitePathVerificator class', () => {
  test('verify method returns success for readable path', async () => {
    const spy = vi.spyOn(fsp, 'access').mockResolvedValue(undefined);

    const config: PrerequisitePathStrategyConfigType = {
      label: 'Readable Path',
      strategy: PrerequisiteStrategyEnum.path,
      path: '/path/to/readable/file',
      access: { write: false, execute: false },
    };

    const result = await PrerequisitePathVerificator.verify(config);

    expect(result).toBe(PrerequisiteStatusEnum.success);
    spy.mockRestore();
  });

  test('verify method returns success for writable path', async () => {
    const spy = vi.spyOn(fsp, 'access').mockResolvedValue(undefined);

    const config: PrerequisitePathStrategyConfigType = {
      label: 'Writable Path',
      strategy: PrerequisiteStrategyEnum.path,
      path: '/path/to/writable/file',
      access: { write: true, execute: false },
    };

    const result = await PrerequisitePathVerificator.verify(config);

    expect(result).toBe(PrerequisiteStatusEnum.success);
    spy.mockRestore();
  });

  test('verify method returns success for executable path', async () => {
    const spy = vi.spyOn(fsp, 'access').mockResolvedValue(undefined);

    const config: PrerequisitePathStrategyConfigType = {
      label: 'Executable Path',
      strategy: PrerequisiteStrategyEnum.path,
      path: '/path/to/executable/file',
      access: { write: false, execute: true },
    };

    const result = await PrerequisitePathVerificator.verify(config);

    expect(result).toBe(PrerequisiteStatusEnum.success);
    spy.mockRestore();
  });

  test('verify method returns failure for inaccessible path', async () => {
    const spy = vi
      .spyOn(fsp, 'access')
      .mockRejectedValue(new Error('Access denied'));

    const config: PrerequisitePathStrategyConfigType = {
      label: 'Inaccessible Path',
      strategy: PrerequisiteStrategyEnum.path,
      path: '/path/to/inaccessible/file',
      access: { write: false, execute: false },
    };

    const result = await PrerequisitePathVerificator.verify(config);

    expect(result).toBe(PrerequisiteStatusEnum.failure);
    spy.mockRestore();
  });
});

