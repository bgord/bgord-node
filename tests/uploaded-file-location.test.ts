import fs from 'node:fs/promises';
import { describe, test, expect, vi } from 'vitest';

import { UploadedFileLocation } from '../src/uploaded-file-location';
import * as Schema from '../src/schema';
import { FileLocation } from '../src/file-location';

describe('UploadedFileLocation class', () => {
  test('constructor sets up properties correctly', () => {
    // Mock file data
    const mockFile: Schema.UploadedFileType = Schema.UploadedFile.parse({
      originalFilename: 'index.html',
      path: '/tmp/uploads',
      fieldName: 'file',
      headers: {},
      size: 1024,
    });

    const uploadedFileLocation = new UploadedFileLocation(mockFile, '/uploads');

    // // Verify properties are set correctly
    expect(uploadedFileLocation.size).toBeDefined();
    expect(uploadedFileLocation.temporary).toEqual(mockFile.path);

    const expectedHandle = new FileLocation({
      parent: '/uploads',
      basename: 'index',
      extension: '.html',
    });
    expect(uploadedFileLocation.handle).toEqual(expectedHandle);
    expect(uploadedFileLocation.handle.summary()).toEqual({
      basename: 'index',
      filename: 'index.html',
      extension: '.html',
      gzipped: '/uploads/index.html.gz',
      parent: '/uploads',
      path: '/uploads/index.html',
    });
    expect(uploadedFileLocation.temporary).toEqual('/tmp/uploads');
  });

  test('transfer method renames the temporary file', async () => {
    const spy = vi.spyOn(fs, 'rename').mockImplementationOnce(async () => {});

    const mockFile: Schema.UploadedFileType = Schema.UploadedFile.parse({
      originalFilename: 'index.html',
      path: '/tmp/uploads',
      fieldName: 'file',
      headers: {},
      size: 1024,
    });

    const uploadedFileLocation = new UploadedFileLocation(mockFile, '/uploads');
    await uploadedFileLocation.transfer();

    expect(fs.rename).toHaveBeenCalledWith(
      mockFile.path,
      uploadedFileLocation.handle.getPath()
    );

    spy.mockRestore();
  });
});
