import sharp from 'sharp';

import * as Schema from './schema';

export type ImageCompressorConfigType = {
  input: Schema.PathType;
  output?: Schema.PathType;
  quality?: Schema.ImageCompressionQualityType;
};

export class ImageCompressor {
  static async compress(config: ImageCompressorConfigType) {
    const input = config.input;
    const output = config.output ?? input;

    const quality = config.quality ?? 85;

    const image = sharp(input);
    const metadata = await image.metadata();
    const format = metadata.format as keyof sharp.FormatEnum;

    return image.toFormat(format, { quality }).toFile(output);
  }
}
