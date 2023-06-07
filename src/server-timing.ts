import express from 'express';
import onHeaders from 'on-headers';

import { Middleware } from './middleware';

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
    const requestStartTimestampMs = Date.now();

    onHeaders(response, () => {
      const requestEndTimestampMs = Date.now();
      const requestDurationMs = requestEndTimestampMs - requestStartTimestampMs;

      response.setHeader(ServerTiming.HEADER, `total;dur=${requestDurationMs}`);
      response.setHeader(ServerTiming.MS_HEADER, requestDurationMs);
    });

    next();
  }
}
