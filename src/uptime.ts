import formatDuration from 'date-fns/formatDuration';

import { Time } from './time';
import { TimestampType } from './schema';

export type UptimeResultType = {
  seconds: TimestampType;
  formatted: ReturnType<typeof formatDuration>;
};

export class Uptime {
  static get(): UptimeResultType {
    const uptimeSeconds = Math.floor(process.uptime());
    const uptimeFormatted = formatDuration(Time.Seconds(uptimeSeconds));

    return {
      seconds: uptimeSeconds,
      formatted: uptimeFormatted,
    };
  }
}
