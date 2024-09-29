import express from "express";
import { describe, test, expect } from "vitest";
import request from "supertest";

import { BasicAuthShield } from "../src/basic-auth-shield";
import * as Schema from "../src/schema";

const validUsername = Schema.BasicAuthUsername.parse("valid-username");
const validPassword = Schema.BasicAuthPassword.parse("valid-password");
const invalidUsername = Schema.BasicAuthUsername.parse("invalid-username");
const invalidPassword = Schema.BasicAuthPassword.parse("invalid-password");

function tokenize(
  username: Schema.BasicAuthUsernameType,
  password: Schema.BasicAuthPasswordType
): string {
  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
}

describe("BasicAuthShield middleware", () => {
  test("allows access with valid credentials", async () => {
    const app = express();

    const basicAuthShield = new BasicAuthShield({
      username: validUsername,
      password: validPassword,
    });

    app.get("/ping", basicAuthShield.verify, (_request, response) => {
      response.status(200).send("pong");
    });

    await request(app)
      .get("/ping")
      .set("Authorization", tokenize(validUsername, validPassword))
      .expect(200);
  });

  test("denies access with missing credentials", async () => {
    const app = express();

    const basicAuthShield = new BasicAuthShield({
      username: validUsername,
      password: validPassword,
    });

    app.get("/ping", basicAuthShield.verify, (_request, _response) =>
      expect.unreachable()
    );

    await request(app).get("/ping").expect(401);
  });

  test("denies access with invalid credentials", async () => {
    const app = express();

    const basicAuthShield = new BasicAuthShield({
      username: validUsername,
      password: validPassword,
    });

    app.get("/ping", basicAuthShield.verify, (_request, _response) =>
      expect.unreachable()
    );

    await request(app)
      .get("/ping")
      .set("Authorization", tokenize(invalidUsername, invalidPassword))
      .expect(401);
  });

  test("works with multiple middlewares", async () => {
    const app = express();

    const basicAuthShield = new BasicAuthShield({
      username: validUsername,
      password: validPassword,
    });

    app.get(
      "/ping",
      (_request, _response, next) => next(),
      basicAuthShield.verify,
      (_request, response) => {
        response.status(200).send("pong");
      }
    );

    await request(app)
      .get("/ping")
      .set("Authorization", tokenize(validUsername, validPassword))
      .expect(200);
  });
});
