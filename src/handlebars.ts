import express from 'express';
import handlebars from 'express-handlebars';
import pluralize from 'pluralize';

import { Dates } from './dates';

export type HandlebarsConfigType = handlebars.ExphbsOptions;

export class Handlebars {
  static handlebarsDefaultConfig: HandlebarsConfigType = {
    extname: '.hbs',
    helpers: {
      datetime: (value: Date) => Dates.datetime(value),
      pluralize: (
        word: Parameters<typeof pluralize>[0],
        count: Parameters<typeof pluralize>[1]
      ) => pluralize(word, count),
    },
  };

  static applyTo(
    app: express.Application,
    _config?: HandlebarsConfigType
  ): void {
    const config = _config ?? Handlebars.handlebarsDefaultConfig;

    app.engine('hbs', handlebars.create(config).engine);
    app.set('view engine', 'hbs');
  }
}
