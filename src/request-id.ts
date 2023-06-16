import express from 'express';
import * as Schema from './schema';
import { NewUUID } from './uuid';

declare global {
  namespace Express {
    export interface Request {
      requestId: Schema.CorrelationIdType;
    }
  }
}

export class RequestId {
  static applyTo(app: express.Application): void {
    app.use(async (request, _response, next) => {
      const requestIdToBeContinued = Schema.CorrelationId.safeParse(
        request.header('continue-request-id')
      );

      if (requestIdToBeContinued.success) {
        request.requestId = requestIdToBeContinued.data;
      } else {
        request.requestId = Schema.CorrelationId.parse(NewUUID.generate());
      }

      next();
    });
  }
}
