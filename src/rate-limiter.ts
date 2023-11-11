import type {TimestampType} from './schema';
import type {Falsy} from "./ts-utils";

export type RateLimiterOptionsType = {
  limitMs: TimestampType;
};

export type RateLimiterResultSuccessType = { allowed: true };
export type RateLimiterResultErrorType = {
  allowed: false;
  remainingMs: TimestampType;
};
export type RateLimiterResultType =
  | RateLimiterResultSuccessType
  | RateLimiterResultErrorType;

export class RateLimiter {
  private lastInvocationTimestampMs: Falsy<TimestampType> = null;

  constructor(private readonly options: RateLimiterOptionsType) {}

  verify(currentTimestampMs: TimestampType): RateLimiterResultType {
    if (
      this.lastInvocationTimestampMs === null ||
      this.lastInvocationTimestampMs === undefined
    ) {
      this.lastInvocationTimestampMs = currentTimestampMs;

      return { allowed: true };
    }

    const nextAllowedTimestampMs =
      this.lastInvocationTimestampMs + this.options.limitMs;

    if (nextAllowedTimestampMs <= currentTimestampMs) {
      this.lastInvocationTimestampMs = currentTimestampMs;

      return { allowed: true };
    }

    return {
      allowed: false,
      remainingMs: nextAllowedTimestampMs - currentTimestampMs,
    };
  }
}
