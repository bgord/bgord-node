import * as path from 'node:path';
import * as fs from 'node:fs/promises';

import * as Schema from './schema';
import { FileLocation, FileLocationConfigType } from './file-location';
import { Size, SizeUnit } from './size';

export class UploadedFileLocation {
  readonly size: Size;

  readonly temporary: Schema.PathType;

  public readonly handle: FileLocation;

  constructor(
    file: Schema.UploadedFileType,
    parent: FileLocationConfigType['parent']
  ) {
    this.size = new Size({ unit: SizeUnit.b, value: file.size });
    this.temporary = file.path;

    const parsed = path.parse(file.originalFilename);

    this.handle = new FileLocation({
      parent,
      basename: parsed.name,
      extension: parsed.ext,
    });
  }

  async transfer(): Promise<void> {
    return fs.rename(this.temporary, this.handle.getPath());
  }
}
