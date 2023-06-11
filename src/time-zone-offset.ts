import express from 'express';

import * as Schema from './schema';
import { Time } from './time';

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
      const timeZoneOffsetMinutes = Schema.TimeZoneOffsetHeaderValue.parse(
        request.header('time-zone-offset')
      );

      request.timeZoneOffset = {
        minutes: timeZoneOffsetMinutes,
        seconds: Time.Minutes(timeZoneOffsetMinutes).toSeconds(),
        miliseconds: Time.Minutes(timeZoneOffsetMinutes).toMs(),
      };

      return next();
    });
  }
}
