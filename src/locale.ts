import express from 'express';

import * as Schema from './schema';

declare global {
  namespace Express {
    export interface Request {
      locale: Schema.LocaleType;
    }
  }
}

export class Locale {
  static applyTo(
    app: express.Application,
    defaultLocale: Schema.LocaleType = 'en'
  ): void {
    app.use((request, _response, next) => {
      const locale = Schema.Locale.default(defaultLocale).parse(
        request.header('locale')
      );

      request.locale = locale;

      return next();
    });
  }
}
