import * as Schema from './schema';
import fs from 'node:fs/promises';

export class File {
  static async getSizeInBytes(
    path: Schema.PathType
  ): Promise<Schema.SizeInBytesType> {
    const file = await fs.stat(path);

    return Schema.SizeInBytes.parse(file.size);
  }
}
