import sharp from 'sharp';

import * as Schema from './schema';

export type ImageResizerConfigType = {
  input: Schema.PathType;
  output?: Schema.PathType;
  width: Schema.WidthType;
};

export class ImageResizer {
  static async resizeToWidth(config: ImageResizerConfigType) {
    const input = config.input;
    const output = config.output ?? input;

    return sharp(input)
      .resize({ width: config.width })
      .toFile(output);
  }
}
