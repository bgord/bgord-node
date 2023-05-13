import * as express from 'express';

import { Middleware } from './middleware';
import * as Schema from './schema';
import type {Falsy} from "./ts-utils";
import * as Errors from "./errors";

type RateLimitShieldOptionsType = {
  limitMs: Schema.TimestampType;
};

type RateLimiterResultType =
  | { allowed: true }
  | { allowed: false; remainingMs: Schema.TimestampType };

class RateLimiter {
  private lastInvocationTimestamp: Falsy<Schema.TimestampType> = null;

  private limitMs: RateLimitShieldOptionsType['limitMs'];

  constructor(options: RateLimitShieldOptionsType) {
    this.limitMs = options.limitMs;
  }

  verify(currentTimestamp: number): RateLimiterResultType {
    if (!this.lastInvocationTimestamp) {
      this.lastInvocationTimestamp = currentTimestamp;

      return { allowed: true };
    }

    const nextAllowedTimestamp = this.lastInvocationTimestamp + this.limitMs;

    if (nextAllowedTimestamp <= currentTimestamp) {
      this.lastInvocationTimestamp = currentTimestamp;

      return { allowed: true };
    }

    return {
      allowed: false,
      remainingMs: nextAllowedTimestamp - currentTimestamp,
    };
  }
}

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
