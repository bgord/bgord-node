import express from 'express';
import handlebars from 'express-handlebars';
import pluralize from 'pluralize';
import _ from 'lodash';

import * as Schema from './schema';
import { DateFormatters } from './dates';

export type HandlebarsConfigType = handlebars.ExphbsOptions & {
  path: Schema.PathType;
};

export class Handlebars {
  static handlebarsDefaultConfig: HandlebarsConfigType = {
    extname: '.hbs',
    helpers: {
      datetime: (value: Date) => DateFormatters.datetime(value),
      pluralize: (
        word: Parameters<typeof pluralize>[0],
        count: Parameters<typeof pluralize>[1]
      ) => pluralize(word, count),
    },
    path: Schema.Path.parse('frontend/views'),
  };

  static applyTo(
    app: express.Application,
    _config?: HandlebarsConfigType
  ): void {
    const config = _.merge(Handlebars.handlebarsDefaultConfig, _config);

    app.engine('hbs', handlebars.create(config).engine);
    app.set('view engine', 'hbs');
    app.set('views', config.path);
  }
}
