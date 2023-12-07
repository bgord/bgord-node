import execa from 'execa';
import { describe, test, expect, vi } from 'vitest';

import {
  PrerequisiteStatusEnum,
  PrerequisiteStrategyEnum,
} from '../src/prerequisites';
import {
  PrerequisiteBinaryStrategyConfigType,
  PrerequisiteBinaryVerificator,
} from '../src/prerequisites/binary';

describe('PrerequisiteBinaryVerificator class', () => {
  test('verify method returns success for existing binary', async () => {
    const spy = vi
      .spyOn(execa, 'command')
      .mockResolvedValue({ exitCode: 0 } as any);

    const config: PrerequisiteBinaryStrategyConfigType = {
      label: 'Existing Binary',
      strategy: PrerequisiteStrategyEnum.binary,
      binary: 'node', // Adjust the binary name based on your needs
    };

    const result = await PrerequisiteBinaryVerificator.verify(config);

    expect(result).toBe(PrerequisiteStatusEnum.success);
    spy.mockRestore();
  });

  test('verify method returns failure for non-existing binary', async () => {
    const spy = vi
      .spyOn(execa, 'command')
      .mockResolvedValue({ exitCode: 1 } as any);

    const config: PrerequisiteBinaryStrategyConfigType = {
      label: 'Non-Existing Binary',
      strategy: PrerequisiteStrategyEnum.binary,
      binary: 'nonexistent', // Adjust the binary name based on your needs
    };

    const result = await PrerequisiteBinaryVerificator.verify(config);

    expect(result).toBe(PrerequisiteStatusEnum.failure);
    spy.mockRestore();
  });

  test('verify method returns failure on error during binary check', async () => {
    const spy = vi
      .spyOn(execa, 'command')
      .mockRejectedValue(new Error('Command execution error'));

    const config: PrerequisiteBinaryStrategyConfigType = {
      label: 'Binary Check Error',
      strategy: PrerequisiteStrategyEnum.binary,
      binary: 'node',
    };

    const result = await PrerequisiteBinaryVerificator.verify(config);

    expect(result).toBe(PrerequisiteStatusEnum.failure);
    spy.mockRestore();
  });

  test('verify method returns failure on binary with whitespace', async () => {
    const spy = vi
      .spyOn(execa, 'command')
      .mockResolvedValue({ exitCode: 0 } as any);

    const config: PrerequisiteBinaryStrategyConfigType = {
      label: 'Binary validation error',
      strategy: PrerequisiteStrategyEnum.binary,
      binary: 'node and something',
    };

    const result = await PrerequisiteBinaryVerificator.verify(config);

    expect(result).toBe(PrerequisiteStatusEnum.failure);
    spy.mockRestore();
  });
});
