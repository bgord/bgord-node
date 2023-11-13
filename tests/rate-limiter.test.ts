import { describe, it, expect } from 'vitest';

import { RateLimiter } from '../src/rate-limiter';

describe('RateLimiter', () => {
  it('should allow the first invocation', () => {
    const ms = 1000;
    const rateLimiter = new RateLimiter({ ms });

    const result = rateLimiter.verify(0);
    expect(result.allowed).toBe(true);
  });

  it('should not allow invocations within the rate limit', () => {
    const ms = 1000;
    const rateLimiter = new RateLimiter({ ms });

    const currentTimestampMs = 0;

    const first = rateLimiter.verify(currentTimestampMs);
    expect(first.allowed).toBe(true);

    const second = rateLimiter.verify(currentTimestampMs + ms - 1);
    expect(second.allowed).toBe(false);
    // @ts-ignore
    expect(second.remainingMs).toBe(1);
  });

  it('should allow invocations just after the rate limit', () => {
    const ms = 1000;
    const rateLimiter = new RateLimiter({ ms });

    const currentTimestampMs = 0;

    const first = rateLimiter.verify(currentTimestampMs);
    expect(first.allowed).toBe(true);

    const second = rateLimiter.verify(currentTimestampMs + ms);
    expect(second.allowed).toBe(true);
  });

  it('should reset the invocation timestamp after the rate limit', () => {
    const ms = 1000;
    const rateLimiter = new RateLimiter({ ms });

    const currentTimestampMs = 0;

    const first = rateLimiter.verify(currentTimestampMs);
    expect(first.allowed).toBe(true);

    const second = rateLimiter.verify(currentTimestampMs + ms);
    expect(second.allowed).toBe(true);

    const third = rateLimiter.verify(currentTimestampMs + ms + 1);
    expect(third.allowed).toBe(false);

    const fourth = rateLimiter.verify(currentTimestampMs + ms + 2);
    expect(fourth.allowed).toBe(false);
  });
});
