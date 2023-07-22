import execa from 'execa';
import { z } from 'zod';

import * as Schema from './schema';

const ImageExifSchema = z.object({
  image: z.object({
    geometry: z.object({ width: Schema.Width, height: Schema.Height }),
    mimeType: z.string().min(1),
    baseName: z.string().min(1),
  }),
});
type ImageExifSchemaType = z.infer<typeof ImageExifSchema>;

const ImageExifOutput = z.array(ImageExifSchema).nonempty();

export type ImageExifOutputType = {
  width: Schema.WidthType;
  height: Schema.HeightType;
  mimeType: ImageExifSchemaType['image']['mimeType'];
  name: ImageExifSchemaType['image']['baseName'];
};

export class ImageEXIF {
  static async read(path: Schema.PathType): Promise<ImageExifOutputType> {
    const { stdout } = await execa('magick', ['convert', path, 'json:']);

    const output = ImageExifOutput.parse(JSON.parse(stdout));

    return {
      width: output[0].image.geometry.width,
      height: output[0].image.geometry.height,
      mimeType: output[0].image.mimeType,
      name: output[0].image.baseName,
    };
  }

  static async clear(path: Schema.PathType) {
    return execa('magick', ['mogrify', '-strip', path]);
  }
}
