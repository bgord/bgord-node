import express from 'express';

import * as Schema from './schema';

declare global {
  namespace Express {
    export interface Request {
      timeZoneOffset: Schema.TimeZoneOffsetType;
    }
  }
}

export class TimeZoneOffset {
  static applyTo(app: express.Application): void {
    app.use((request, _response, next) => {
      const timeZoneOffset = Schema.TimeZoneOffset.parse(
        request.header('time-zone-offset')
      );

      request.timeZoneOffset = timeZoneOffset;

      return next();
    });
  }
}
