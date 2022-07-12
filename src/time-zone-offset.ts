import express from 'express';

import * as Schema from './schema';

export type TimeZoneOffsetsType = {
  minutes: Schema.TimeZoneOffsetType;
  seconds: Schema.TimeZoneOffsetType;
  miliseconds: Schema.TimeZoneOffsetType;
};

declare global {
  namespace Express {
    export interface Request {
      timeZoneOffset: TimeZoneOffsetsType;
    }
  }
}

export class TimeZoneOffset {
  static applyTo(app: express.Application): void {
    app.use((request, _response, next) => {
      const timeZoneOffset = Schema.TimeZoneOffset.parse(
        request.header('time-zone-offset')
      );

      request.timeZoneOffset = {
        minutes: timeZoneOffset,
        seconds: timeZoneOffset * 60,
        miliseconds: timeZoneOffset * 60 * 1000,
      };

      return next();
    });
  }
}
