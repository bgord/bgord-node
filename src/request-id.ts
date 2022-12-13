import express from 'express';
import * as Schema from './schema';
import { UUID } from './uuid';

declare global {
  namespace Express {
    export interface Response {
      locals: { requestId: Schema.RequestIdType };
    }
  }
}

export class RequestId {
  static applyTo(app: express.Application): void {
    app.use(async (_request, response, next) => {
      response.locals.requestId = Schema.RequestId.parse(UUID.generate());

      next();
    });
  }
}
