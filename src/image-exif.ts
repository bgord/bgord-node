import execa from 'execa';

import * as Schema from './schema';

export class ImageEXIF {
  static async clear(path: Schema.PathType) {
    return execa('magick', ['mogrify', '-strip', path]);
  }
}
