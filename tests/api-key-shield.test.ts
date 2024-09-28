import express from 'express';
import { describe, test, expect } from 'vitest';
import request from 'supertest';
import { ApiKeyShield } from '../src/api-key-shield';
import { AccessDeniedError } from '../src/errors';

const VALID_API_KEY = 'valid-api-key';
const INVALID_API_KEY = 'invalid-api-key';

const apiKeyShield = new ApiKeyShield({ API_KEY: VALID_API_KEY });

describe('ApiKeyShield middleware', () => {
  test('allows access with valid API key', async () => {
    const app = express();

    app.get('/ping', apiKeyShield.verify, (_request, response) => {
      response.status(200).send('pong');
    });

    await request(app)
      .get('/ping')
      .set(ApiKeyShield.HEADER_NAME, VALID_API_KEY)
      .expect(200);
  });

  test('denies access with missing API key', async () => {
    const app = express();

    app.get(
      '/ping',
      apiKeyShield.verify,
      (_request, _response) => expect.unreachable(),
      (error, request, response, next) => {
        if (error instanceof AccessDeniedError) {
          return response.status(403).send('Access denied');
        }
        return next();
      }
    );

    const result = await request(app)
      .get('/ping')
      .expect(403);

    expect(result.text).toEqual('Access denied');
  });

  test('denies access with invalid API key', async () => {
    const app = express();

    app.get(
      '/ping',
      apiKeyShield.verify,
      (_request, _response) => expect.unreachable(),
      (error, request, response, next) => {
        if (error instanceof AccessDeniedError) {
          return response.status(403).send('Access denied');
        }
        return next();
      }
    );

    const result = await request(app)
      .get('/ping')
      .set(ApiKeyShield.HEADER_NAME, INVALID_API_KEY)
      .expect(403);

    expect(result.text).toContain('Access denied');
  });

  test('works with multiple middlewares', async () => {
    const app = express();

    app.get(
      '/ping',
      (_request, _response, next) => {
        // Another middleware
        next();
      },
      apiKeyShield.verify,
      (_request, response) => {
        response.status(200).send('pong');
      }
    );

    await request(app)
      .get('/ping')
      .set(ApiKeyShield.HEADER_NAME, VALID_API_KEY)
      .expect(200);
  });
});
