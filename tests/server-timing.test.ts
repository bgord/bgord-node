import express from 'express';
import { describe, test, expect } from 'vitest';
import request from 'supertest';

import { Time } from '../src/time';
import { sleep } from '../src/sleep';
import { ServerTiming } from '../src/server-timing';

describe('ServerTiming middleware', () => {
  test('works for a standard case', async () => {
    const app = express();

    app.get('/ping', ServerTiming.handle, (_request, response) =>
      response.status(200).send('pong')
    );

    const result = await request(app)
      .get('/ping')
      .expect(200);

    expect(result.text).toEqual('pong');
    expect(result.headers[ServerTiming.HEADER.toLowerCase()]).toContain(
      'total;dur='
    );
    expect(result.headers[ServerTiming.MS_HEADER.toLowerCase()]).toBeTruthy();
  });

  test('works for a longer operation', async () => {
    const app = express();

    app.get('/ping', ServerTiming.handle, async (_request, response) => {
      await sleep({ ms: Time.Ms(100).value });
      response.status(200).send('pong');
    });

    const result = await request(app)
      .get('/ping')
      .expect(200);

    expect(result.text).toEqual('pong');
    expect(result.headers[ServerTiming.HEADER.toLowerCase()]).toContain(
      'total;dur='
    );
    expect(
      Number(result.headers[ServerTiming.MS_HEADER.toLowerCase()])
    ).toBeGreaterThanOrEqual(100);
  });
});
