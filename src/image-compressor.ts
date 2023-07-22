import execa from 'execa';

import { PathType, ImageCompressionQualityType } from './schema';

export type ImageCompressorConfigType = {
  input: PathType;
  quality?: ImageCompressionQualityType;
};

export class ImageCompressor {
  static async compress(config: ImageCompressorConfigType) {
    const quality = config.quality ?? 85;

    return execa('magick', [
      'convert',
      '-strip',
      '-interlace',
      'Plane',
      '-quality',
      `${quality}%`,
      config.input,
      config.input,
    ]);
  }
}
