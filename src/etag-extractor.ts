import express from 'express';

import { ETag, WeakETag } from './etag';

declare global {
  namespace Express {
    export interface Request {
      ETag: ETag | null;
      WeakETag: WeakETag | null;
    }
  }
}

export class ETagExtractor {
  static applyTo(app: express.Application): void {
    app.use(async (request, _response, next) => {
      try {
        const header = String(request.headers[ETag.IF_MATCH_HEADER_NAME]);
        const etag = ETag.fromHeader(header);
        request.ETag = etag;
      } catch (error) {
        request.ETag = null;
      }

      next();
    });
  }
}

export class WeakETagExtractor {
  static applyTo(app: express.Application): void {
    app.use(async (request, _response, next) => {
      try {
        const header = String(request.headers[WeakETag.IF_MATCH_HEADER_NAME]);
        const weakEtag = WeakETag.fromHeader(header);
        request.WeakETag = weakEtag;
      } catch (error) {
        request.WeakETag = null;
      }

      next();
    });
  }
}
