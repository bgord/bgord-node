import { describe, test, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

import { Route } from '../src/route';
import { Time } from '../src/time';
import { RateLimitShield } from '../src/rate-limit-shield';
import * as Errors from '../src/errors';

describe('RateLimitShield middleware', () => {
  test('allows the request when within rate limit', async () => {
    const app = express();

    app.get(
      '/ping',
      RateLimitShield.build({ ms: 1000 }),
      Route((_request, response) => response.status(200).send('pong')),
      (error, _request, response, _next) => {
        if (error instanceof Errors.TooManyRequestsError) {
          return response.status(429).send();
        }
        expect.unreachable();
      }
    );

    const result = await request(app)
      .get('/ping')
      .expect(200);

    expect(result.text).toEqual('pong');
  });

  test('throws TooManyRequestsError when exceeding rate limit', async () => {
    const app = express();

    app.get(
      '/ping',
      RateLimitShield.build({ ms: 1000 }),
      Route((_request, response) => response.status(200).send('pong')),
      (error, _request, response, _next) => {
        if (error instanceof Errors.TooManyRequestsError) {
          return response.status(429).send();
        }
        expect.unreachable();
      }
    );

    // Send two requests within 1000 milliseconds
    await request(app)
      .get('/ping')
      .expect(200);

    await request(app)
      .get('/ping')
      .expect(429);
  });

  test('allows the request after waiting for the rate limit', async () => {
    vi.useFakeTimers();
    const app = express();

    app.get(
      '/ping',
      RateLimitShield.build({ ms: 1000 }),
      Route((_request, response) => response.status(200).send('pong')),
      (error, _request, response, _next) => {
        if (error instanceof Errors.TooManyRequestsError) {
          return response.status(429).send();
        }
        expect.unreachable();
      }
    );

    // Send two requests within 1000 milliseconds
    await request(app)
      .get('/ping')
      .expect(200);

    vi.advanceTimersByTime(Time.Seconds(1).ms);

    // Send another request after waiting
    const result = await request(app)
      .get('/ping')
      .expect(200);

    expect(result.text).toEqual('pong');
    vi.useRealTimers();
  });
});
