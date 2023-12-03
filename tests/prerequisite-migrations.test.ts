import execa from 'execa';
import { describe, test, expect, vi } from 'vitest';

import {
  PrerequisiteStatusEnum,
  PrerequisiteStrategyEnum,
} from '../src/prerequisites';
import {
  PrerequisiteMigrationsStrategyConfigType,
  PrerequisiteMigrationsVerificator,
} from '../src/prerequisites/migrations';

describe('PrerequisiteMigrationsVerificator class', () => {
  test('verify method returns success for successful migrations status', async () => {
    const spy = vi
      .spyOn(execa, 'command')
      .mockResolvedValue({ exitCode: 0 } as any);

    const config: PrerequisiteMigrationsStrategyConfigType = {
      label: 'Successful Migrations Status',
      strategy: PrerequisiteStrategyEnum.migrations,
    };

    const result = await PrerequisiteMigrationsVerificator.verify(config);

    expect(result).toBe(PrerequisiteStatusEnum.success);
    spy.mockRestore();
  });

  test('verify method returns failure for failed migrations status', async () => {
    const spy = vi
      .spyOn(execa, 'command')
      .mockResolvedValue({ exitCode: 1 } as any);

    const config: PrerequisiteMigrationsStrategyConfigType = {
      label: 'Failed Migrations Status',
      strategy: PrerequisiteStrategyEnum.migrations,
    };

    const result = await PrerequisiteMigrationsVerificator.verify(config);

    expect(result).toBe(PrerequisiteStatusEnum.failure);
    spy.mockRestore();
  });

  test('verify method returns failure on error during migrations status check', async () => {
    const spy = vi
      .spyOn(execa, 'command')
      .mockRejectedValue(new Error('Command execution error'));

    const config: PrerequisiteMigrationsStrategyConfigType = {
      label: 'Migrations Status Check Error',
      strategy: PrerequisiteStrategyEnum.migrations,
    };

    const result = await PrerequisiteMigrationsVerificator.verify(config);

    expect(result).toBe(PrerequisiteStatusEnum.failure);
    spy.mockRestore();
  });
});
