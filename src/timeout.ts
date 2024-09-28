import onHeaders from 'on-headers';
import express from 'express';

import { TimestampType } from './schema';
import { RequestTimeoutError } from './errors';

type TimeoutConfigType = {
  ms: TimestampType;
};

export class Timeout {
  static build(config: TimeoutConfigType) {
    return function handle(
      request: express.Request,
      response: express.Response,
      next: express.NextFunction
    ) {
      const timeout = setTimeout(() => request.emit('timeout'), config.ms);

      request.on('timeout', () => next(new RequestTimeoutError(config)));
      onHeaders(response, () => clearTimeout(timeout));

      return next();
    };
  }
}
