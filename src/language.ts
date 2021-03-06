import express from 'express';
import Path from 'path';
import { promises as fs, PathLike } from 'fs';
import parser from 'accept-language-parser';

import * as Schema from './schema';
import { Reporter } from './reporter';

export type TranslationsType = Record<string, string>;

declare global {
  namespace Express {
    export interface Request {
      language: Schema.LanguageType;
      supportedLanguages: Schema.LanguageType[];
      translationsPath: PathLike;
    }
  }
}

export class Language {
  static applyTo(
    app: express.Application,
    translationsPath: PathLike,
    defaultLanguageName: Schema.LanguageType = 'en'
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

  static async getTranslations(
    language: Schema.LanguageType,
    translationsPath: PathLike
  ): Promise<TranslationsType> {
    try {
      const file = await fs.readFile(
        Path.resolve(translationsPath as string, `${language}.json`)
      );

      return JSON.parse(file.toString());
    } catch (error) {
      Reporter.raw('I18n#getTranslations', error);

      return {};
    }
  }

  private static async getSupportedLanguages(
    traslationsPath: PathLike
  ): Promise<Schema.LanguageType[]> {
    try {
      const supportedLanguageFiles = await fs.readdir(traslationsPath);
      return supportedLanguageFiles.map(filename => Path.parse(filename).name);
    } catch (error) {
      Reporter.raw('I18n#getSupportedLanguages', error);

      return [];
    }
  }
}
