import fsp from 'fs/promises';
import { constants } from 'fs';

import * as Schema from '../schema';
import { I18n, I18nConfigType, TranslationsKeyType } from '../i18n';
import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
} from '../prerequisites';

export type PrerequisiteTranslationsStrategyConfigType = {
  label: PrerequisiteLabelType;
  strategy: PrerequisiteStrategyEnum.translations;
  translationsPath?: typeof I18n.DEFAULT_TRANSLATIONS_PATH;
  supportedLanguages: I18nConfigType['supportedLanguages'];
};

type PrerequisiteTranslationsProblemType = {
  translationKey: TranslationsKeyType;
  existsInLanguage: Schema.LanguageType;
  missingInLanguage: Schema.LanguageType;
};

export class PrerequisiteTranslationsVerificator {
  static async verify(
    config: PrerequisiteTranslationsStrategyConfigType
  ): Promise<PrerequisiteStatusEnum> {
    const translationsPath =
      config.translationsPath ?? I18n.DEFAULT_TRANSLATIONS_PATH;

    try {
      await fsp.access(translationsPath, constants.R_OK);

      for (const language in config.supportedLanguages) {
        await fsp.access(
          I18n.getTranslationPathForLanguage(language),
          constants.R_OK
        );
      }
    } catch (error) {
      return PrerequisiteStatusEnum.failure;
    }

    const supportedLanguages = Object.keys(config.supportedLanguages);

    if (supportedLanguages.length === 1) return PrerequisiteStatusEnum.success;

    const languageToTranslationKeys: Record<
      Schema.LanguageType,
      TranslationsKeyType[]
    > = {};

    const problems: PrerequisiteTranslationsProblemType[] = [];

    for (const language of supportedLanguages) {
      const translations = await I18n.getTranslations(
        language,
        translationsPath
      );
      const translationKeys = Object.keys(translations);

      languageToTranslationKeys[language] = translationKeys;
    }

    for (const currentLanguage in languageToTranslationKeys) {
      const translationKeys = languageToTranslationKeys[currentLanguage] ?? [];

      for (const translationKey of translationKeys) {
        for (const supportedLanguage of supportedLanguages) {
          if (supportedLanguage === currentLanguage) continue;

          const translationKeyExists = languageToTranslationKeys[
            supportedLanguage
          ]?.some(key => translationKey === key);

          if (!translationKeyExists) {
            problems.push({
              translationKey,
              existsInLanguage: currentLanguage,
              missingInLanguage: supportedLanguage,
            });
          }
        }
      }
    }

    if (problems.length === 0) return PrerequisiteStatusEnum.success;

    console.log(problems);

    return PrerequisiteStatusEnum.failure;
  }
}
