import { describe, test, expect } from 'vitest';
import express from 'express';
import request from 'supertest';

import * as Schema from '../src/schema';
import { TimeZoneOffsetsType } from '../src/time-zone-offset';
import { Context } from '../src/context';

export type ContextType = {
  requestId: Schema.CorrelationIdType;
  timeZoneOffset: TimeZoneOffsetsType;
};

declare global {
  namespace Express {
    export interface Request {
      requestId: Schema.CorrelationIdType;
      context: ContextType;
    }
  }
}

describe('Context class', () => {
  test('applyTo method adds context to the request', async () => {
    const app = express();

    // Mock request
    const mockRequestId = 'mock-request-id';
    const mockTimeZoneOffset = {
      minutes: 60,
      seconds: 3600,
      miliseconds: 3600000,
    };

    app.use((req, _res, next) => {
      req.requestId = mockRequestId as any;
      req.timeZoneOffset = mockTimeZoneOffset;
      return next();
    });

    // Apply Context middleware
    Context.applyTo(app);

    // Define a route that uses the context
    app.get('/ping', (req, res) => {
      res.json(req.context);
    });

    // Make a request to the route
    const result = await request(app)
      .get('/ping')
      .expect(200);

    // Verify that the context is added to the request
    const expectedContext = {
      requestId: mockRequestId,
      timeZoneOffset: mockTimeZoneOffset,
    };

    expect(result.body).toEqual(expectedContext);
  });
});
