import express from 'express';

import * as Schema from './schema';
import { Time } from './time';

export type TimeZoneOffsetsType = {
  minutes: Schema.TimeZoneOffsetValueType;
  seconds: Schema.TimeZoneOffsetValueType;
  miliseconds: Schema.TimeZoneOffsetValueType;
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
        seconds: Time.Minutes(timeZoneOffsetMinutes).seconds,
        miliseconds: Time.Minutes(timeZoneOffsetMinutes).ms,
      };

      return next();
    });
  }

  static adjustTimestamp(
    timestamp: Schema.TimestampType,
    timeZoneOffsetMs: Schema.TimeZoneOffsetValueType
  ): Schema.TimestampType {
    return timestamp - timeZoneOffsetMs;
  }

  static adjustDate(
    timestamp: Schema.TimestampType,
    timeZoneOffsetMs: Schema.TimeZoneOffsetValueType
  ): Date {
    return new Date(timestamp - timeZoneOffsetMs);
  }
}
