import express from 'express';
import onHeaders from 'on-headers';

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
  static CONTINUE_HEADER = 'continue-request-id';

  static applyTo(app: express.Application): void {
    app.use(async (request, response, next) => {
      const requestIdToBeContinued = Schema.CorrelationId.safeParse(
        request.header(RequestId.CONTINUE_HEADER)
      );

      if (requestIdToBeContinued.success) {
        request.requestId = requestIdToBeContinued.data;
      } else {
        request.requestId = Schema.CorrelationId.parse(NewUUID.generate());
      }

      onHeaders(response, () =>
        response.setHeader(RequestId.CONTINUE_HEADER, request.requestId)
      );

      next();
    });
  }
}
