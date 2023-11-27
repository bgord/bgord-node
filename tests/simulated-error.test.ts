import express from 'express';
import { describe, test, expect } from 'vitest';
import request from 'supertest';
import { SimulatedError } from '../src/simulated-error';

describe('SimulatedError middleware', () => {
  test('throws an error', async () => {
    const app = express();

    app.get('/ping', SimulatedError.throw, (_request, _response) =>
      expect.unreachable()
    );

    const result = await request(app)
      .get('/ping')
      .expect(500);

    expect(result.text).toContain('Simulated error');
  });

  test('works with multiple middlewares', async () => {
    const app = express();

    app.get(
      '/ping',
      (_request, _response, next) => next(),
      SimulatedError.throw,
      (_request, _response) => expect.unreachable()
    );

    const result = await request(app)
      .get('/ping')
      .expect(500);

    expect(result.text).toContain('Simulated error');
  });
});
