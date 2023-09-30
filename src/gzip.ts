import { createGzip, createGunzip } from 'node:zlib';
import { pipeline } from 'node:stream';
import { createReadStream, createWriteStream, PathLike } from 'node:fs';
import { promisify } from 'node:util';

type GzipCompressConfigType = { input: PathLike; output: PathLike };

export class Gzip {
  static async compress(config: GzipCompressConfigType) {
    return promisify(pipeline)(
      createReadStream(config.input),
      createGzip(),
      createWriteStream(config.output)
    );
  }

  static async uncompress(config: GzipCompressConfigType) {
    return promisify(pipeline)(
      createReadStream(config.input),
      createGunzip(),
      createWriteStream(config.output)
    );
  }
}
