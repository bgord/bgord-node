import express from 'express';
import onHeaders from 'on-headers';

import { Middleware } from './middleware';

export class ServerTiming {
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

      response.setHeader('Server-Timing', `total;dur=${requestDurationMs}`);
    });

    next();
  }
}
