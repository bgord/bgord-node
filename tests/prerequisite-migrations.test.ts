import execa from 'execa';
import { describe, test, expect, vi } from 'vitest';

import { PrerequisiteStatusEnum } from '../src/prerequisites';
import { PrerequisiteMigrations } from '../src/prerequisites/migrations';

describe.skip('PrerequisiteMigrations class', () => {
  test('verify method returns success for successful migrations status', async () => {
    const spy = vi
      .spyOn(execa, 'execa')
      // @ts-ignore
      .mockResolvedValue({ exitCode: 0 } as any);

    const result = await new PrerequisiteMigrations({
      label: 'migrations',
    }).verify();

    expect(result).toBe(PrerequisiteStatusEnum.success);
    spy.mockRestore();
  });

  test('verify method returns failure for failed migrations status', async () => {
    const spy = vi
      .spyOn(execa, 'execa')
      // @ts-ignore
      .mockResolvedValue({ exitCode: 1 } as any);

    const result = await new PrerequisiteMigrations({
      label: 'migrations',
    }).verify();

    expect(result).toBe(PrerequisiteStatusEnum.failure);
    spy.mockRestore();
  });

  test('verify method returns failure on error during migrations status check', async () => {
    const spy = vi
      .spyOn(execa, 'execa')
      // @ts-ignore
      .mockRejectedValue(new Error('Command execution error'));

    const result = await new PrerequisiteMigrations({
      label: 'migrations',
    }).verify();

    expect(result).toBe(PrerequisiteStatusEnum.failure);
    spy.mockRestore();
  });
});
