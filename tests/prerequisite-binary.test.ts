import execa from 'execa';
import { describe, test, expect, vi } from 'vitest';

import { PrerequisiteStatusEnum } from '../src/prerequisites';
import { PrerequisiteBinary } from '../src/prerequisites/binary';

describe('PrerequisiteBinaryVerificator class', () => {
  test('verify method returns success for existing binary', async () => {
    const spy = vi
      .spyOn(execa, 'command')
      .mockResolvedValue({ exitCode: 0 } as any);

    const result = await new PrerequisiteBinary({
      label: 'binary',
      binary: 'node',
    }).verify();

    expect(result).toBe(PrerequisiteStatusEnum.success);
    spy.mockRestore();
  });

  test('verify method returns failure for non-existing binary', async () => {
    const spy = vi
      .spyOn(execa, 'command')
      .mockResolvedValue({ exitCode: 1 } as any);

    const result = await new PrerequisiteBinary({
      label: 'binary',
      binary: 'nonexistent',
    }).verify();

    expect(result).toBe(PrerequisiteStatusEnum.failure);
    spy.mockRestore();
  });

  test('verify method returns failure on error during binary check', async () => {
    const spy = vi
      .spyOn(execa, 'command')
      .mockRejectedValue(new Error('Command execution error'));

    const result = await new PrerequisiteBinary({
      label: 'binary',
      binary: 'node',
    }).verify();

    expect(result).toBe(PrerequisiteStatusEnum.failure);
    spy.mockRestore();
  });

  test('verify method returns failure on binary with whitespace', async () => {
    const spy = vi
      .spyOn(execa, 'command')
      .mockResolvedValue({ exitCode: 0 } as any);

    const result = await new PrerequisiteBinary({
      label: 'binary',
      binary: 'node and something',
    }).verify();

    expect(result).toBe(PrerequisiteStatusEnum.failure);
    spy.mockRestore();
  });
});
