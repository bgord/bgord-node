import sharp from 'sharp';
import path from 'path';

import * as Schema from './schema';

export type ImageExifOutputType = {
  width: Schema.WidthType;
  height: Schema.HeightType;
  name: path.ParsedPath['base'];
};

export type ImageExifClearConfigType = {
  input: Schema.PathType;
  output: Schema.PathType;
};

export class ImageEXIF {
  static async read(input: Schema.PathType): Promise<ImageExifOutputType> {
    const image = sharp(input);
    const metadata = await image.metadata();

    const name = path.parse(input).base;

    return {
      width: Schema.Width.parse(metadata.width),
      height: Schema.Height.parse(metadata.height),
      name,
    };
  }

  static async clear(config: ImageExifClearConfigType) {
    return sharp(config.input)
      .rotate()
      .toFile(config.output);
  }
}
