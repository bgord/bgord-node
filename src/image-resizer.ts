import sharp from 'sharp';

import * as Schema from './schema';

export type ImageResizerWidthConfigType = {
  input: Schema.PathType;
  output: Schema.PathType;
  width: Schema.WidthType;
};

export type ImageResizerHeightConfigType = {
  input: Schema.PathType;
  output: Schema.PathType;
  height: Schema.HeightType;
};

export class ImageResizer {
  static async resizeToWidth(
    config: ImageResizerWidthConfigType
  ): Promise<sharp.OutputInfo> {
    return sharp(config.input)
      .resize({ width: config.width })
      .toFile(config.output);
  }

  static async resizeToHeight(
    config: ImageResizerHeightConfigType
  ): Promise<sharp.OutputInfo> {
    return sharp(config.input)
      .resize({ height: config.height })
      .toFile(config.output);
  }
}
