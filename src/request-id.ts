import express from 'express';
import * as Schema from './schema';
import { NewUUID } from './uuid';

declare global {
  namespace Express {
    export interface Request {
      requestId: Schema.RequestIdType;
    }
  }
}

export class RequestId {
  static applyTo(app: express.Application): void {
    app.use(async (request, _response, next) => {
      request.requestId = Schema.RequestId.parse(NewUUID.generate());

      next();
    });
  }
}
