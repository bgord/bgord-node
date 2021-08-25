import express from 'express';
import handlebars from 'express-handlebars';

import { Dates } from './dates';

export type HandlebarsConfigType = handlebars.ExphbsOptions;

export class Handlebars {
  config: HandlebarsConfigType;
  handlebarsDefaultConfig: HandlebarsConfigType = {
    extname: '.hbs',
    helpers: {
      datetime: (value: Date) => Dates.datetime(value),
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
