import express from 'express';
import NodeCache from 'node-cache';
import { describe, test, expect } from 'vitest';
import request from 'supertest';
import { CacheResponse, CacheHitEnum } from '../src/cache-response';

describe('CacheResponse middleware', () => {
  test('returns cached response with Cache-Hit: hit', async () => {
    const app = express();
    const cache = new NodeCache();
    const middleware = new CacheResponse(cache);

    const responseData = { message: 'Cached response' };
    cache.set('/cached', responseData);

    app.get('/cached', middleware.handle, (_request, response) =>
      response.status(200).json(responseData)
    );

    const result = await request(app)
      .get('/cached')
      .expect(200);

    expect(result.header['cache-hit']).toBe(CacheHitEnum.hit);
    expect(result.body).toEqual(responseData);
  });

  test('calls next when response is not found in the cache with Cache-Hit: miss', async () => {
    const app = express();
    const cache = new NodeCache();
    const middleware = new CacheResponse(cache);

    app.get('/not-cached', middleware.handle, (_request, response) =>
      response.status(200).send('Not cached')
    );

    const result = await request(app)
      .get('/not-cached')
      .expect(200);

    expect(result.header['cache-hit']).toBe(CacheHitEnum.miss);
    expect(result.text).toBe('Not cached');
  });

  test('clears the cache with clear middleware', async () => {
    const app = express();
    const cache = new NodeCache();
    const middleware = new CacheResponse(cache);

    const responseData = { message: 'Cached response' };
    cache.set('/cached', responseData);

    app.get('/cached', middleware.handle, (_request, response) =>
      response.status(200).json(responseData)
    );

    app.get('/clear-cache', middleware.clear, (_request, response) =>
      response.status(200).send('Cache cleared')
    );

    const cachedResult = await request(app)
      .get('/cached')
      .expect(200);

    expect(cachedResult.header['cache-hit']).toBe(CacheHitEnum.hit);
    expect(cachedResult.body).toEqual(responseData);

    const clearResult = await request(app)
      .get('/clear-cache')
      .expect(200);

    expect(clearResult.text).toBe('Cache cleared');

    const missResult = await request(app)
      .get('/cached')
      .expect(200);

    expect(missResult.header['cache-hit']).toBe(CacheHitEnum.miss);
    expect(missResult.body).toEqual(responseData);
  });
});
