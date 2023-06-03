import onHeaders from 'on-headers';
import express from 'express';

import { Middleware } from './middleware';
import { TimestampType } from './schema';
import { RequestTimeoutError } from './errors';

type TimeoutConfigType = {
  timeoutMs: TimestampType;
};

export class Timeout {
  static build(config: TimeoutConfigType) {
    function handle(
      request: express.Request,
      response: express.Response,
      next: express.NextFunction
    ) {
      const timeout = setTimeout(
        () => request.emit('timeout'),
        config.timeoutMs
      );

      request.on('timeout', () => next(new RequestTimeoutError(config)));
      onHeaders(response, () => clearTimeout(timeout));

      return next();
    }

    return Middleware(handle);
  }
}
