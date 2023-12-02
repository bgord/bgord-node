import express from 'express';
import { describe, test, expect } from 'vitest';
import request from 'supertest';
import { Middleware } from '../src/middleware';

describe('Middleware', () => {
  test('does not do anything for happy path middleware', async () => {
    const app = express();

    app.get(
      '/ping',
      Middleware((_request, _response, next) => next()),
      (_request, response) => response.status(200).send('pong')
    );

    await request(app)
      .get('/ping')
      .expect(200);
  });

  test('catches an error', async () => {
    const app = express();

    app.get(
      '/ping',
      Middleware((_request, _response) => {
        throw new Error('Test error');
      }),
      (_request, _response) => expect.unreachable()
    );

    await request(app)
      .get('/ping')
      .expect(500)
      .expect(response => expect(response.text).toContain('Test error'));
  });
});
