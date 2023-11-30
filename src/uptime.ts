import { DateFormatters } from './dates';
import { RoundToNearest } from './rounding';
import { Time } from './time';
import { TimestampType } from './schema';

export type UptimeResultType = {
  seconds: TimestampType;
  formatted: ReturnType<typeof DateFormatters['relative']>;
};

export class Uptime {
  static get(): UptimeResultType {
    const rounding = new RoundToNearest();
    const uptime = Time.Seconds(rounding.round(process.uptime()));
    const uptimeFormatted = DateFormatters.relative(Date.now() - uptime.ms);

    return { seconds: uptime.value, formatted: uptimeFormatted };
  }
}
