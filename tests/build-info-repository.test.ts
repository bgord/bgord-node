import { describe, test, expect, vi } from 'vitest';
import fs from 'node:fs/promises';

import { BuildInfoRepository } from '../src/build-info-repository';
import * as Schema from '../src/schema';

describe('BuildInfoRepository class', () => {
  test('extract method returns build info with version from package.json', async () => {
    const packageJson = { version: '1.2.0' };

    const spy = vi
      .spyOn(fs, 'readFile')
      .mockResolvedValue(Buffer.from(JSON.stringify(packageJson)));

    const buildInfo = await BuildInfoRepository.extract();

    expect(buildInfo).toEqual({
      BUILD_DATE: expect.any(Number),
      BUILD_VERSION: Schema.BuildVersion.parse(packageJson.version),
    });

    spy.mockRestore();
  });

  test('extract method returns build info without version if package.json is not found', async () => {
    const spy = vi
      .spyOn(fs, 'readFile')
      .mockRejectedValue(new Error('File not found'));

    // Call the extract method
    const buildInfo = await BuildInfoRepository.extract();

    // Assert that the build info does not include the version
    const expectedBuildInfo = {
      BUILD_DATE: expect.any(Number),
    };

    expect(buildInfo).toEqual(expectedBuildInfo);

    spy.mockRestore();
  });
});
