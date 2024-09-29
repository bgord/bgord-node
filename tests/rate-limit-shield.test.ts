import { describe, test, expect, vi } from "vitest";
import express from "express";
import request from "supertest";

import { Time } from "../src/time";
import { RateLimitShield } from "../src/rate-limit-shield";
import * as Errors from "../src/errors";

describe("RateLimitShield middleware", () => {
  test("allows the request when within rate limit", async () => {
    const app = express();

    app.get(
      "/ping",
      RateLimitShield.build({ ms: 1000 }),
      (_request: express.Request, response: express.Response) => {
        response.status(200).send("pong");
      },
      (
        error: express.Errback,
        _request: express.Request,
        response: express.Response,
        _next: express.NextFunction
      ) => {
        if (error instanceof Errors.TooManyRequestsError) {
          response.status(429).send();
          return;
        }
        expect.unreachable();
      }
    );

    const result = await request(app).get("/ping").expect(200);

    expect(result.text).toEqual("pong");
  });

  test("throws TooManyRequestsError when exceeding rate limit", async () => {
    const app = express();

    app.get(
      "/ping",
      RateLimitShield.build({ ms: 1000 }),
      (_request: express.Request, response: express.Response) => {
        response.status(200).send("pong");
      },
      (
        error: express.Errback,
        _request: express.Request,
        response: express.Response,
        _next: express.NextFunction
      ) => {
        if (error instanceof Errors.TooManyRequestsError) {
          response.status(429).send();
          return;
        }
        expect.unreachable();
      }
    );

    // Send two requests within 1000 milliseconds
    await request(app).get("/ping").expect(200);

    await request(app).get("/ping").expect(429);
  });

  test("allows the request after waiting for the rate limit", async () => {
    vi.useFakeTimers();
    const app = express();

    app.get(
      "/ping",
      RateLimitShield.build({ ms: 1000 }),
      (_request: express.Request, response: express.Response) => {
        response.status(200).send("pong");
      },
      (
        error: express.Errback,
        _request: express.Request,
        response: express.Response,
        _next: express.NextFunction
      ) => {
        if (error instanceof Errors.TooManyRequestsError) {
          response.status(429).send();
          return;
        }
        expect.unreachable();
      }
    );

    // Send two requests within 1000 milliseconds
    await request(app).get("/ping").expect(200);

    vi.advanceTimersByTime(Time.Seconds(1).ms);

    // Send another request after waiting
    const result = await request(app).get("/ping").expect(200);

    expect(result.text).toEqual("pong");
    vi.useRealTimers();
  });
});
