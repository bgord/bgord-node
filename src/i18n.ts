import express from 'express';
import Path from 'path';
import fs from 'fs/promises';

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

export type I18nConfigType = {
  translationsPath?: Schema.PathType;
  defaultLanguage?: Schema.LanguageType;
  supportedLanguages: Record<string, Schema.LanguageType>;
};

declare global {
  namespace Express {
    export interface Request {
      language: Schema.LanguageType;
      supportedLanguages: Schema.LanguageType[];
      translationsPath: Schema.PathType;
    }
  }
}

export class I18n {
  static LANGUAGE_COOKIE_NAME = 'accept-language';

  static DEFAULT_TRANSLATIONS_PATH = Schema.Path.parse('infra/translations');

  static FALLBACK_LANGUAGE = 'en';

  static applyTo(app: express.Application, config: I18nConfigType): void {
    app.use(async (request, _response, next) => {
      const translationsPath =
        config?.translationsPath ?? I18n.DEFAULT_TRANSLATIONS_PATH;

      const defaultLanguage = config?.defaultLanguage ?? I18n.FALLBACK_LANGUAGE;

      const chosenLanguage =
        request.cookies[I18n.LANGUAGE_COOKIE_NAME] ?? defaultLanguage;

      const language = Object.keys(config.supportedLanguages).find(
        language => language === chosenLanguage
      )
        ? chosenLanguage
        : I18n.FALLBACK_LANGUAGE;

      request.supportedLanguages = Object.keys(config.supportedLanguages);
      request.language = language;
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
