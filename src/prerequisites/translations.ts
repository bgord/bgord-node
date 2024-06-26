import fsp from 'node:fs/promises';
import { constants } from 'node:fs';

import * as Schema from '../schema';
import { I18n, I18nConfigType, TranslationsKeyType } from '../i18n';
import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
  AbstractPrerequisite,
} from '../prerequisites';

export type PrerequisiteTranslationsConfigType = {
  translationsPath?: typeof I18n.DEFAULT_TRANSLATIONS_PATH;
  supportedLanguages: I18nConfigType['supportedLanguages'];
  label: PrerequisiteLabelType;
  enabled?: boolean;
};

type PrerequisiteTranslationsProblemType = {
  translationKey: TranslationsKeyType;
  existsInLanguage: Schema.LanguageType;
  missingInLanguage: Schema.LanguageType;
};

export class PrerequisiteTranslations extends AbstractPrerequisite<
  PrerequisiteTranslationsConfigType
> {
  readonly strategy = PrerequisiteStrategyEnum.translations;

  constructor(readonly config: PrerequisiteTranslationsConfigType) {
    super(config);
  }

  async verify(): Promise<PrerequisiteStatusEnum> {
    if (!this.enabled) return PrerequisiteStatusEnum.undetermined;

    const translationsPath =
      this.config.translationsPath ?? I18n.DEFAULT_TRANSLATIONS_PATH;

    try {
      await fsp.access(translationsPath, constants.R_OK);

      for (const language in this.config.supportedLanguages) {
        await fsp.access(
          I18n.getTranslationPathForLanguage(language),
          constants.R_OK
        );
      }
    } catch (error) {
      return this.reject();
    }

    const supportedLanguages = Object.keys(this.config.supportedLanguages);

    if (supportedLanguages.length === 1) return this.pass();

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

    if (problems.length === 0) return this.pass();

      // biome-ignore lint: lint/suspicious/noConsoleLog
    console.log(problems);

    return this.reject();
  }
}
