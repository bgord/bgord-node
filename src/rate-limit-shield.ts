import * as express from 'express';

import * as Schema from './schema';
import * as Errors from './errors';

import { RateLimiter } from './rate-limiter';

type RateLimitShieldOptionsType = {
  ms: Schema.TimestampType;
};

export class RateLimitShield {
  static build(options: RateLimitShieldOptionsType) {
    const rateLimiter = new RateLimiter(options);

    return function verify(
      _request: express.Request,
      _response: express.Response,
      next: express.NextFunction
    ) {
      const currentTimestampMs = Date.now();
      const check = rateLimiter.verify(currentTimestampMs);

      if (!check.allowed) {
        throw new Errors.TooManyRequestsError(check.remainingMs);
      }

      return next();
    };
  }
}
