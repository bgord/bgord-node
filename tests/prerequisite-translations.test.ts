import fsp from 'fs/promises';
import { I18n } from '../src/i18n';
import { describe, test, expect, vi } from 'vitest';
import {
  PrerequisiteStatusEnum,
  PrerequisiteStrategyEnum,
} from '../src/prerequisites';
import {
  PrerequisiteTranslationsStrategyConfigType,
  PrerequisiteTranslationsVerificator,
} from '../src/prerequisites/translations';

describe('PrerequisiteTranslationsVerificator class', () => {
  test('verify method returns failure for translations that not exist', async () => {
    const spy = vi
      .spyOn(fsp, 'access')
      .mockRejectedValue(new Error('Does not exist'));

    const config: PrerequisiteTranslationsStrategyConfigType = {
      label: 'Valid Translations',
      strategy: PrerequisiteStrategyEnum.translations,
      supportedLanguages: { en: 'en', es: 'es' },
    };

    const result = await PrerequisiteTranslationsVerificator.verify(config);

    expect(result).toBe(PrerequisiteStatusEnum.failure);
    spy.mockRestore();
  });

  test('verify method returns success for translations that exists', async () => {
    const spy = vi.spyOn(fsp, 'access').mockResolvedValue(undefined);

    const config: PrerequisiteTranslationsStrategyConfigType = {
      label: 'Valid Translations',
      strategy: PrerequisiteStrategyEnum.translations,
      supportedLanguages: { en: 'en' },
    };

    const result = await PrerequisiteTranslationsVerificator.verify(config);

    expect(result).toBe(PrerequisiteStatusEnum.success);
    spy.mockRestore();
  });

  test('verify method returns failure for inconsistent translations', async () => {
    vi.spyOn(process, 'exit').mockImplementation(vi.fn());

    vi.spyOn(I18n, 'getTranslations').mockImplementation(
      async (language: string) => {
        switch (language) {
          case 'en':
            return {
              key1: 'English Translation 1',
              key2: 'English Translation 2',
            } as any;
          case 'es':
            return { key1: 'Spanish Translation 1' } as any;
          default:
            return {} as any;
        }
      }
    );

    const config: PrerequisiteTranslationsStrategyConfigType = {
      label: 'Inconsistent Translations',
      strategy: PrerequisiteStrategyEnum.translations,
      supportedLanguages: {
        en: 'English',
        es: 'Spanish',
      },
    };

    const result = await PrerequisiteTranslationsVerificator.verify(config);

    expect(result).toBe(PrerequisiteStatusEnum.failure);
    vi.restoreAllMocks();
  });
});
