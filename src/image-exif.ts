import sharp from 'sharp';
import execa from 'execa';
import path from 'path';

import * as Schema from './schema';

export type ImageExifOutputType = {
  width: Schema.WidthType;
  height: Schema.HeightType;
  name: path.ParsedPath['base'];
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

  static async clear(path: Schema.PathType) {
    return execa('magick', ['mogrify', '-strip', path]);
  }
}
