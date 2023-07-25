import sharp from 'sharp';

import * as Schema from './schema';

export type ImageConverterType = keyof sharp.FormatEnum;

export type ImageConverterConfigType = {
  input: Schema.PathType;
  output: Schema.PathType;
};

export class ImageConverter {
  static async convert(
    format: ImageConverterType,
    config: ImageConverterConfigType
  ) {
    return sharp(config.input)
      .toFormat(format)
      .toFile(config.output);
  }
}
