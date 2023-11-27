import express from 'express';
import { describe, test, expect } from 'vitest';
import request from 'supertest';
import { MethodOverride } from '../src/method-override';

describe('MethodOverride middleware', () => {
  test('overrides HTTP method using _method parameter', async () => {
    const app = express();
    MethodOverride.applyTo(app);

    app.put('/ping', (request, response) =>
      response.status(200).json({ method: request.method })
    );

    const result = await request(app)
      .post('/ping')
      .query({ _method: 'PUT' })
      .expect(200);

    expect(result.body.method).toBe('PUT');
  });

  test('does not override HTTP method when _method parameter is not provided', async () => {
    const app = express();
    MethodOverride.applyTo(app);

    app.put('/ping', (request, response) =>
      response.status(200).json({ method: request.method })
    );

    const result = await request(app)
      .put('/ping')
      .expect(200);

    expect(result.body.method).toBe('PUT');
  });

  test('does not override HTTP method for non-overridable methods', async () => {
    const app = express();
    MethodOverride.applyTo(app);

    app.get('/ping', (request, response) =>
      response.status(200).json({ method: request.method })
    );

    const result = await request(app)
      .get('/ping')
      .query({ _method: 'POST' })
      .expect(200);

    expect(result.body.method).toBe('GET');
  });

  test('handles invalid _method parameter gracefully', async () => {
    const app = express();
    MethodOverride.applyTo(app);

    app.put('/ping', (request, response) =>
      response.status(200).json({ method: request.method })
    );

    await request(app)
      .post('/ping')
      .query({ _method: 'INVALID_METHOD' })
      .expect(404);
  });
});
