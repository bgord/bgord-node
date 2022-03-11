import express from 'express';
import Path from 'path';
import { promises as fs, PathLike } from 'fs';
import parser from 'accept-language-parser';

import * as Schema from './schema';
import { Reporter } from './reporter';

declare global {
  namespace Express {
    export interface Request {
      language: Schema.LanguageNameType;
      supportedLanguages: Schema.LanguageNameType[];
      translationsPath: PathLike;
    }
  }
}

export class Language {
  static applyTo(
    app: express.Application,
    translationsPath: PathLike,
    defaultLanguageName: Schema.LanguageNameType = 'en'
  ): void {
    app.use(async (request, _response, next) => {
      const supportedLanguages = await Language.getSupportedLanguages(
        translationsPath
      );

      const acceptedLanguages = parser.parse(
        request.headers['accept-language']
      );

      const languageName = parser.pick(supportedLanguages, acceptedLanguages);

      request.supportedLanguages = supportedLanguages;
      request.language = languageName ?? defaultLanguageName;
      request.translationsPath = translationsPath;

      return next();
    });
  }

  private static async getSupportedLanguages(
    path: PathLike
  ): Promise<Schema.LanguageNameType[]> {
    try {
      const supportedLanguageFiles = await fs.readdir(path);

      return supportedLanguageFiles.map(filename => Path.parse(filename).name);
    } catch (error) {
      Reporter.raw('I18n#build', error);

      return [];
    }
  }
}
