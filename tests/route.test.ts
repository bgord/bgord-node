import express from 'express';
import { describe, test, expect } from 'vitest';
import request from 'supertest';
import { Route } from '../src/route';

describe('Route', () => {
  test('does not do anything for happy path middleware', async () => {
    const app = express();

    app.get(
      '/ping',
      Route((_request, response) => response.status(200).send('pong'))
    );

    await request(app)
      .get('/ping')
      .expect(200);
  });

  test('catches an error', async () => {
    const app = express();

    app.get(
      '/ping',
      Route((_request, _response) => {
        throw new Error('Test error');
      })
    );

    await request(app)
      .get('/ping')
      .expect(500)
      .expect(response => expect(response.text).toContain('Test error'));
  });
});
