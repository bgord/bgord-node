import * as express from 'express';

import { Middleware } from './middleware';
import * as Schema from './schema';
import * as Errors from './errors';

import { RateLimiter } from './rate-limiter';

type RateLimitShieldOptionsType = {
  limitMs: Schema.TimestampType;
};

export class RateLimitShield {
  static build(options: RateLimitShieldOptionsType) {
    const rateLimiter = new RateLimiter(options);

    function verify(
      _request: express.Request,
      _response: express.Response,
      next: express.NextFunction
    ) {
      const currentTimestamp = Date.now();
      const check = rateLimiter.verify(currentTimestamp);

      if (!check.allowed) {
        throw new Errors.TooManyRequestsError(check.remainingMs);
      }

      return next();
    }

    return Middleware(verify);
  }
}