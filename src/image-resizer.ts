import execa from 'execa';

import { PathType, WidthType } from './schema';

export type ImageResizerConfigType = {
  input: PathType;
  output?: PathType;
  width: WidthType;
};

export class ImageResizer {
  static async resizeToWidth(config: ImageResizerConfigType) {
    const input = config.input;
    const output = config.output ?? input;

    return execa('convert', [input, '-resize', `${config.width}x`, output]);
  }
}
