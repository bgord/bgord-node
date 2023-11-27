import express from 'express';
import { describe, test, expect } from 'vitest';
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

    const result = await request(app)
      .get('/ping')
      .expect(200);

    expect(result.text).toEqual('pong');
  });

  test('works for a standard case', async () => {
    const app = express();

    app.get(
      '/ping',
      Timeout.build({ ms: Time.Ms(100).value }),
      async (_request, response) => {
        await sleep({ ms: Time.Ms(120).value });
        return response.status(200).send('pong');
      }
    );

    await request(app)
      .get('/ping')
      .expect(500);
  });
});
