import formatDuration from 'date-fns/formatDuration';

import { TimestampType } from './schema';

export type UptimeResultType = {
  seconds: TimestampType;
  formatted: ReturnType<typeof formatDuration>;
};

export class Uptime {
  static get(): UptimeResultType {
    const uptimeSeconds = Math.floor(process.uptime());
    const uptimeFormatted = formatDuration({ seconds: uptimeSeconds });

    return {
      seconds: uptimeSeconds,
      formatted: uptimeFormatted,
    };
  }
}
