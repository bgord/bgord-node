import express from 'express';
import Path from 'path';
import fs from 'fs/promises';
import parser from 'accept-language-parser';

import * as Schema from './schema';

export type TranslationsKeyType = string;
export type TranslationsValueType = string;
export type TranslationsType = Record<
  TranslationsKeyType,
  TranslationsValueType
>;

export type TranslationPlaceholderType = string;
export type TranslationPlaceholderValueType = string | number;
export type TranslationVariableType = Record<
  TranslationPlaceholderType,
  TranslationPlaceholderValueType
>;

declare global {
  namespace Express {
    export interface Request {
      language: Schema.LanguageType;
      supportedLanguages: Schema.LanguageType[];
      translationsPath: Schema.PathType;
    }
  }
}

type LanguageConfigType = {
  translationsPath?: Schema.PathType;
  defaultLanguageName?: Schema.LanguageType;
};

export class Language {
  static applyTo(app: express.Application, config?: LanguageConfigType): void {
    app.use(async (request, _response, next) => {
      const translationsPath =
        config?.translationsPath ?? Schema.Path.parse('infra/translations');
      const defaultLanguageName = config?.defaultLanguageName ?? 'en';

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
    translationsPath: Schema.PathType
  ): Promise<TranslationsType> {
    try {
      const file = await fs.readFile(
        Path.resolve(translationsPath as string, `${language}.json`)
      );

      return JSON.parse(file.toString());
    } catch (error) {
      console.log('I18n#getTranslations', error);

      return {};
    }
  }

  static useTranslations(translations: TranslationsType) {
    return function translate(
      key: TranslationsKeyType,
      variables?: TranslationVariableType
    ) {
      const translation = translations[key];

      if (!translation) {
        console.warn(`[@bgord/node] missing translation for key: ${key}`);
        return key;
      }

      if (!variables) return translation;

      return Object.entries(variables).reduce(
        (result, [placeholder, value]) =>
          result.replace(`{{${placeholder}}}`, String(value)),
        translation
      );
    };
  }

  private static async getSupportedLanguages(
    traslationsPath: Schema.PathType
  ): Promise<Schema.LanguageType[]> {
    try {
      const supportedLanguageFiles = await fs.readdir(traslationsPath);
      return supportedLanguageFiles.map(filename => Path.parse(filename).name);
    } catch (error) {
      console.log('I18n#getSupportedLanguages', error);

      return [];
    }
  }
}
