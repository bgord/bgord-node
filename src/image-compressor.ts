import { execa } from 'execa';
import { gzip } from 'gzip-cli';

import { PathType, ImageCompressionQualityType } from './schema';

export type ImageCompressorConfigType = {
  input: PathType;
  quality?: ImageCompressionQualityType;
};

export class ImageCompressor {
  static async compress(config: ImageCompressorConfigType) {
    const quality = config.quality ?? 85;

    return execa('convert', [
      '-strip',
      '-interlace',
      'Plane',
      '-quality',
      `${quality}%`,
      config.input,
      config.input,
    ]);
  }

  static async package(config: ImageCompressorConfigType) {
    return gzip({ patterns: [config.input], outputExtensions: ['gz', 'br'] });
  }
}
