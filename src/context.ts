import express from 'express';
import * as Schema from './schema';
import { TimeZoneOffsetsType } from './time-zone-offset';

export type ContextType = {
  requestId: Schema.CorrelationIdType;
  timeZoneOffset: TimeZoneOffsetsType;
};

declare global {
  namespace Express {
    export interface Request {
      context: ContextType;
    }
  }
}

export class Context {
  static applyTo(app: express.Application): void {
    app.use(async (request, _response, next) => {
      request.context = {
        requestId: request.requestId,
        timeZoneOffset: request.timeZoneOffset,
      };

      return next();
    });
  }
}
