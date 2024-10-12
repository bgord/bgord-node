import { Env } from "hono";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

import * as Schema from "../schema";
import { RateLimiter } from "../rate-limiter";

type RateLimitShieldOptionsType = { ms: Schema.TimestampType };

export const TooManyRequestsError = new HTTPException(429, {
  message: "app.too_many_requests",
});

export function rateLimitShield<E extends Env = Env>(
  options: RateLimitShieldOptionsType
) {
  const rateLimiter = new RateLimiter(options);

  return createMiddleware<E>(async (_c, next) => {
    const currentTimestampMs = Date.now();
    const check = rateLimiter.verify(currentTimestampMs);

    if (!check.allowed) {
      throw TooManyRequestsError;
    }

    return next();
  });
}
