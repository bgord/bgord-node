import fs from 'fs/promises';
import { constants } from 'fs';

import { I18n, I18nConfigType } from '../i18n';
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

export class PrerequisiteTranslationsVerificator {
  static async verify(
    config: PrerequisiteTranslationsStrategyConfigType
  ): Promise<PrerequisiteStatusEnum> {
    const translationsPath =
      config.translationsPath ?? I18n.DEFAULT_TRANSLATIONS_PATH;

    try {
      await fs.access(translationsPath, constants.R_OK);

      for (const language in config.supportedLanguages) {
        await fs.access(
          I18n.getTranslationPathForLanguage(language),
          constants.R_OK
        );
      }
    } catch (error) {
      return PrerequisiteStatusEnum.failure;
    }

    return PrerequisiteStatusEnum.success;
  }
}
