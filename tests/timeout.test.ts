import express from 'express';
import { describe, test } from 'vitest';
import request from 'supertest';

import { Time } from '../src/time';
import { sleep } from '../src/sleep';
import { Timeout } from '../src/timeout';

describe('Timeout middleware', () => {
  test('works for a standard case', async () => {
    const app = express();

    app.get('/ping', Timeout.build(Time.Seconds(1)), (_request, response) =>
      response.status(200).send('pong')
    );

    await request(app)
      .get('/ping')
      .expect(200);
  });

  test('works for a standard case', async () => {
    const app = express();

    app.get('/ping', Timeout.build({ ms: 100 }), async (_request, response) => {
      await sleep({ ms: 120 });
      return response.status(200).send('pong');
    });

    await request(app)
      .get('/ping')
      .expect(500);
  });
});
