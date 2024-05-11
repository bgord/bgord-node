import express from 'express';
import { describe, test, expect } from 'vitest';
import request from 'supertest';

import { ETag, WeakETag } from '../src/etag';
import { ETagExtractor, WeakETagExtractor } from '../src/etag-extractor';

declare global {
  namespace Express {
    interface Request {
      ETag: ETag | null;
      WeakETag: WeakETag | null;
    }
  }
}

describe('ETagExtractor middleware', () => {
  test('extracts ETag from valid header', async () => {
    const app = express();

    ETagExtractor.applyTo(app);

    app.get('/ping', (request, response) =>
      response.status(200).send({ etag: request.ETag })
    );

    const result = await request(app)
      .get('/ping')
      .set('If-Match', '12345')
      .expect(200);

    expect(result.body.etag.revision).toEqual(12345);
    expect(result.body.etag.value).toEqual('12345');
  });

  test('handles missing ETag header gracefully', async () => {
    const app = express();

    ETagExtractor.applyTo(app);

    app.get('/ping', (request, response) =>
      response.status(200).send({ etag: request.ETag })
    );

    const result = await request(app)
      .get('/ping')
      .expect(200);

    expect(result.body.etag).toBeNull();
  });

  test('handles invalid ETag header gracefully', async () => {
    const app = express();

    ETagExtractor.applyTo(app);

    app.get('/ping', (request, response) =>
      response.status(200).send({ etag: request.ETag })
    );

    const result = await request(app)
      .get('/ping')
      .set('If-Match', 'invalid-etag')
      .expect(200);

    expect(result.body.etag).toBeNull();
  });

  describe('WeakETagExtractor middleware', () => {
    test('extracts WeakETag from valid header', async () => {
      const app = express();

      WeakETagExtractor.applyTo(app);

      app.get('/ping', (request, response) =>
        response.status(200).send({ weakETag: request.WeakETag })
      );

      const result = await request(app)
        .get('/ping')
        .set('If-Match', 'W/12345')
        .expect(200);

      expect(result.body.weakETag.revision).toEqual(12345);
      expect(result.body.weakETag.value).toEqual('W/12345');
    });

    test('handles missing WeakETag header gracefully', async () => {
      const app = express();

      WeakETagExtractor.applyTo(app);

      app.get('/ping', (request, response) =>
        response.status(200).send({ weakETag: request.WeakETag })
      );

      const result = await request(app)
        .get('/ping')
        .expect(200);

      expect(result.body.weakETag).toBeNull();
    });

    test('handles invalid WeakETag header gracefully', async () => {
      const app = express();

      WeakETagExtractor.applyTo(app);

      app.get('/ping', (request, response) => {
        response.status(200).send({ weakETag: request.WeakETag });
      });

      const result = await request(app)
        .get('/ping')
        .set('If-Match', 'invalid-weak-etag')
        .expect(200);

      expect(result.body.weakETag).toBeNull();
    });
  });
});
