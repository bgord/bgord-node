import Path from 'path';
import { promises as fs, PathLike } from 'fs';

import * as Schema from './schema';

type I18nConfigType = {
  language: Schema.LanguageNameType;
  path: PathLike;
};

export class I18n {
  language: I18nConfigType['language'];

  path: I18nConfigType['path'];

  translations: Record<string, string> = {};

  constructor(config: I18nConfigType) {
    this.language = config.language;
    this.path = config.path;
  }

  async build() {
    const path = Path.resolve(this.path as string, `${this.language}.json`);

    this.translations = JSON.parse((await fs.readFile(path)).toString());

    return this;
  }
}
