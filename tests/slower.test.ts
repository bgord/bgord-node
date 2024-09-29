import express from "express";
import { describe, test, expect } from "vitest";
import request from "supertest";

import { Stopwatch } from "../src/stopwatch";
import { Slower } from "../src/slower";

describe("Slower middleware", () => {
  test("works with default configuration", async () => {
    const app = express();

    app.get("/ping", Slower.build(), (_request, response) => {
      response.status(200).send("pong");
    });

    const stopwatch = new Stopwatch();

    await request(app).get("/ping").expect(200);

    expect(stopwatch.stop().durationMs).toBeGreaterThanOrEqual(500);
  });

  test("works with custom configuration", async () => {
    const app = express();

    app.get("/ping", Slower.build({ ms: 50 }), (_request, response) => {
      response.status(200).send("pong");
    });

    const stopwatch = new Stopwatch();
    await request(app).get("/ping").expect(200);

    expect(stopwatch.stop().durationMs).toBeGreaterThanOrEqual(50);
  });

  test("works with zero milliseconds configuration", async () => {
    const app = express();

    app.get("/ping", Slower.build({ ms: 0 }), (_request, response) => {
      response.status(200).send("pong");
    });

    const stopwatch = new Stopwatch();
    await request(app).get("/ping").expect(200);

    expect(stopwatch.stop().durationMs).toBeGreaterThanOrEqual(0);
  });

  test("works with multiple middlewares", async () => {
    const app = express();

    app.get(
      "/ping",
      Slower.build({ ms: 50 }),
      (_request, _response, next) => next(),
      (_request, response) => {
        response.status(200).send("pong");
      }
    );

    const stopwatch = new Stopwatch();
    await request(app).get("/ping").expect(200);

    expect(stopwatch.stop().durationMs).toBeGreaterThanOrEqual(50);
  });
});
