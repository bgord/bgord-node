import express from 'express';
import onHeaders from 'on-headers';

import { Middleware } from './middleware';
import { Stopwatch } from './stopwatch';

export class ServerTiming {
  static HEADER = 'Server-Timing';

  static MS_HEADER = 'Server-Timing-Ms';

  static applyTo(app: express.Application): void {
    app.use(ServerTiming.handle);
  }

  static handle = Middleware(ServerTiming._handle);

  private static async _handle(
    _request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    const stopwatch = new Stopwatch();

    onHeaders(response, () => {
      const { durationMs } = stopwatch.stop();

      response.setHeader(ServerTiming.HEADER, `total;dur=${durationMs}`);
      response.setHeader(ServerTiming.MS_HEADER, durationMs);
    });

    next();
  }
}
