import express from 'express';
import methodOverride from 'method-override';

export class MethodOverride {
  static applyTo(app: express.Application): void {
    app.use(methodOverride('_method') as express.RequestHandler);
  }
}
