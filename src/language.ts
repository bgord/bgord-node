import express from 'express';
import parser from 'accept-language-parser';

import * as Schema from './schema';

declare global {
  namespace Express {
    export interface Request {
      language: Schema.LanguageNameType;
    }
  }
}

const defaultLanguageName = 'en';

export class Language {
  static applyTo(
    app: express.Application,
    supportedLanguageNames: Schema.LanguageNameType[] = [defaultLanguageName]
  ): void {
    app.use((request, _response, next) => {
      const acceptedLanguages = parser.parse(
        request.headers['accept-language']
      );

      const languageName = parser.pick(
        supportedLanguageNames,
        acceptedLanguages
      );

      request.language = languageName ?? defaultLanguageName;

      return next();
    });
  }
}
