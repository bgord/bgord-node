import formatDuration from 'date-fns/formatDuration';

export class Uptime {
  static get() {
    const uptimeSeconds = Math.floor(process.uptime());
    const uptimeFormatted = formatDuration({ seconds: uptimeSeconds });

    return {
      uptime: {
        seconds: uptimeSeconds,
        formatted: uptimeFormatted,
      },
    };
  }
}
