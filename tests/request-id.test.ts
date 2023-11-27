import express from 'express';
import { describe, test, expect } from 'vitest';
import request from 'supertest';

import { RequestId } from '../src/request-id';
import { NewUUID } from '../src/uuid';

describe('RequestId middleware', () => {
  test('sets requestId when continue-request-id header is provided', async () => {
    const app = express();
    RequestId.applyTo(app);

    app.get('/ping', (request, response) =>
      response.status(200).json({ requestId: request.requestId })
    );

    const continueRequestId = NewUUID.generate();

    const result = await request(app)
      .get('/ping')
      .set('continue-request-id', continueRequestId)
      .expect(200);

    expect(result.body.requestId).toBe(continueRequestId);
    expect(result.header[RequestId.CONTINUE_HEADER]).toBe(continueRequestId);
  });

  test('generates requestId when continue-request-id header is not provided', async () => {
    const app = express();
    RequestId.applyTo(app);

    app.get('/ping', (request, response) =>
      response.status(200).json({ requestId: request.requestId })
    );

    const result = await request(app)
      .get('/ping')
      .expect(200);

    expect(result.body.requestId).toBeDefined();
    expect(result.header[RequestId.CONTINUE_HEADER]).toBe(
      result.body.requestId
    );
  });

  test('sets continue-request-id header on response', async () => {
    const app = express();
    RequestId.applyTo(app);

    app.get('/ping', (_request, response) => response.status(200).send('pong'));

    const result = await request(app)
      .get('/ping')
      .expect(200);

    expect(result.header[RequestId.CONTINUE_HEADER]).toBeDefined();
  });

  test('handles invalid continue-request-id header gracefully', async () => {
    const app = express();
    RequestId.applyTo(app);

    app.get('/ping', (_request, response) => response.status(200).send('pong'));

    const result = await request(app)
      .get('/ping')
      .set('continue-request-id', 'invalid-id')
      .expect(200);

    expect(result.header[RequestId.CONTINUE_HEADER]).toBeDefined();
    expect(result.header[RequestId.CONTINUE_HEADER]).not.toBe('invalid-id');
  });
});
