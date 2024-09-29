import express from "express";
import { describe, test, expect, vi } from "vitest";
import request from "supertest";

import * as Schema from "../src/schema";
import { ApiVersion } from "../src/api-version";
import { BuildInfoRepository } from "../src/build-info-repository";

describe("ApiVersion middleware", () => {
  test("sets API version in header with known build version", async () => {
    const spy = vi.spyOn(BuildInfoRepository, "extract").mockResolvedValue({
      BUILD_DATE: 123,
      BUILD_VERSION: Schema.BuildVersion.parse("1.0.0"),
    });

    const app = express();

    app.get("/ping", ApiVersion.attach, (_request, response) => {
      response.status(200).send("pong");
    });

    const result = await request(app).get("/ping").expect(200);

    expect(spy).toBeCalledTimes(1);
    expect(result.header[ApiVersion.HEADER_NAME]).toBe("1.0.0");
    spy.mockRestore();
  });

  test("sets default API version in header with unknown build version", async () => {
    const spy = vi.spyOn(BuildInfoRepository, "extract").mockResolvedValue({
      BUILD_DATE: 123,
      BUILD_VERSION: Schema.BuildVersion.parse("unknown"),
    });

    const app = express();

    app.get("/ping", ApiVersion.attach, (_request, response) => {
      response.status(200).send("pong");
    });

    const result = await request(app).get("/ping").expect(200);

    expect(result.header[ApiVersion.HEADER_NAME]).toBe(
      ApiVersion.DEFAULT_API_VERSION
    );
    spy.mockRestore();
  });
});
