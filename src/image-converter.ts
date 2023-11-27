import sharp from 'sharp';

import * as Schema from './schema';

export type ImageConverterType = keyof sharp.FormatEnum;

export type ImageConverterConfigType = {
  format: ImageConverterType;
  input: Schema.PathType;
  output: Schema.PathType;
};

export class ImageConverter {
  static async convert(
    config: ImageConverterConfigType
  ): Promise<sharp.OutputInfo> {
    return sharp(config.input)
      .toFormat(config.format)
      .toFile(config.output);
  }
}
