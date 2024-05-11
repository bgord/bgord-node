import sharp from 'sharp';
import path from 'node:path';
import mime from 'mime-types';

import * as Schema from './schema';
import { MimeRawType } from './mime';

export type ImageExifOutputType = {
  width: Schema.WidthType;
  height: Schema.HeightType;
  name: path.ParsedPath['base'];
  mimeType: MimeRawType;
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
      mimeType: String(mime.contentType(String(metadata.format))),
    };
  }

  static async clear(
    config: ImageExifClearConfigType
  ): Promise<sharp.OutputInfo> {
    return sharp(config.input)
      .rotate()
      .toFile(config.output);
  }
}
