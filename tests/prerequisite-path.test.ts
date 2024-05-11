import fsp from 'node:fs/promises';
import { describe, test, expect, vi } from 'vitest';
import { PrerequisiteStatusEnum } from '../src/prerequisites';
import { PrerequisitePath } from '../src/prerequisites/path';

describe('PrerequisitePath class', () => {
  test('verify method returns success for readable path', async () => {
    const spy = vi.spyOn(fsp, 'access').mockResolvedValue(undefined);

    const result = await new PrerequisitePath({
      label: 'path',
      path: '/path/to/readable/file',
      access: { write: false, execute: false },
    }).verify();

    expect(result).toBe(PrerequisiteStatusEnum.success);
    spy.mockRestore();
  });

  test('verify method returns success for writable path', async () => {
    const spy = vi.spyOn(fsp, 'access').mockResolvedValue(undefined);

    const result = await new PrerequisitePath({
      label: 'path',
      path: '/path/to/writable/file',
      access: { write: true, execute: false },
    }).verify();

    expect(result).toBe(PrerequisiteStatusEnum.success);
    spy.mockRestore();
  });

  test('verify method returns success for executable path', async () => {
    const spy = vi.spyOn(fsp, 'access').mockResolvedValue(undefined);

    const result = await new PrerequisitePath({
      label: 'path',
      path: '/path/to/executable/file',
      access: { write: false, execute: true },
    }).verify();

    expect(result).toBe(PrerequisiteStatusEnum.success);
    spy.mockRestore();
  });

  test('verify method returns failure for inaccessible path', async () => {
    const spy = vi
      .spyOn(fsp, 'access')
      .mockRejectedValue(new Error('Access denied'));

    const result = await new PrerequisitePath({
      label: 'path',
      path: '/path/to/inaccessible/file',
      access: { write: false, execute: false },
    }).verify();

    expect(result).toBe(PrerequisiteStatusEnum.failure);
    spy.mockRestore();
  });
});
