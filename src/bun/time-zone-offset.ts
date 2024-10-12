import { createMiddleware } from "hono/factory";

import * as Schema from "../schema";
import { Time } from "../time";

export type TimeZoneOffsetVariables = {
  timeZoneOffset: {
    minutes: Schema.TimeZoneOffsetValueType;
    seconds: Schema.TimeZoneOffsetValueType;
    miliseconds: Schema.TimeZoneOffsetValueType;
  };
};

export class TimeZoneOffset {
  static attach = <T extends { Variables: TimeZoneOffsetVariables }>() =>
    createMiddleware<T>(async (c, next) => {
      const timeZoneOffsetMinutes = Schema.TimeZoneOffsetHeaderValue.parse(
        c.req.header("time-zone-offset")
      );

      const timeZoneOffset = {
        minutes: timeZoneOffsetMinutes,
        seconds: Time.Minutes(timeZoneOffsetMinutes).seconds,
        miliseconds: Time.Minutes(timeZoneOffsetMinutes).ms,
      };

      c.set("timeZoneOffset", timeZoneOffset);

      await next();
    });

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
