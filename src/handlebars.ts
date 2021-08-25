import express from 'express';
import handlebars from 'express-handlebars';
import pluralize from 'pluralize';

import { Dates } from './dates';

export type HandlebarsConfigType = handlebars.ExphbsOptions;

export class Handlebars {
  config: HandlebarsConfigType;
  handlebarsDefaultConfig: HandlebarsConfigType = {
    extname: '.hbs',
    helpers: {
      datetime: (value: Date) => Dates.datetime(value),
      pluralize: (
        word: Parameters<typeof pluralize>[0],
        count: Parameters<typeof pluralize>[1]
      ) => pluralize(word, count),
    },
  };

  constructor(config?: HandlebarsConfigType) {
    this.config = config ?? this.handlebarsDefaultConfig;
  }

  applyTo(app: express.Application): void {
    app.engine('hbs', handlebars.create(this.config).engine);
    app.set('view engine', 'hbs');
  }
}
