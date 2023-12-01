import { describe, test, expect, vi } from 'vitest';

import fs from 'node:fs/promises';
import * as Schema from '../src/schema';
import { File } from '../src/file';

describe('File class', () => {
  test('getSizeInBytes method returns size of the file in bytes', async () => {
    const filePath = Schema.Path.parse('test-file.txt');
    const spy = vi.spyOn(fs, 'stat');
    spy.mockImplementationOnce(() => ({ size: 1024 } as any));

    const result = await File.getSizeInBytes(filePath);

    expect(result).toEqual(1024);
    spy.mockRestore();
  });

  test('getSizeInBytes method throws error for non-existent file', async () => {
    const filePath = Schema.Path.parse('non-existent-file.txt');
    const spy = vi.spyOn(fs, 'stat');
    spy.mockRejectedValue(new Error('ENOENT: no such file or directory'));

    await expect(File.getSizeInBytes(filePath)).rejects.toThrow(
      'ENOENT: no such file or directory'
    );
  });
});
