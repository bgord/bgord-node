import express from 'express';
import handlebars from 'express-handlebars';

export type HandlebarsConfigType = handlebars.ExphbsOptions;

export class Handlebars {
  config: HandlebarsConfigType;
  handlebarsDefaultConfig: HandlebarsConfigType = { extname: '.hbs' };

  constructor(config?: HandlebarsConfigType) {
    this.config = config ?? this.handlebarsDefaultConfig;
  }

  applyTo(app: express.Application): void {
    app.engine('handlebars', handlebars.create(this.config).engine);
    app.set('view engine', 'handlebars');
  }
}
