import * as express from 'express';
import { Middleware } from './middleware';

export enum CacheStaticFilesStrategy {
  never = 'never',
  always = 'always',
}

export class CacheStaticFiles {
  static handle(strategy: CacheStaticFilesStrategy) {
    function _handle(
      _request: express.Request,
      response: express.Response,
      next: express.NextFunction
    ) {
      if (strategy === CacheStaticFilesStrategy.never) {
        response.setHeader(
          'cache-control',
          'private, no-cache, no-store, must-revalidate'
        );
      }
      if (strategy === CacheStaticFilesStrategy.always) {
        response.setHeader(
          'cache-control',
          'public, max-age=31536000, immutable'
        );
      }
      return next();
    }

    return Middleware(_handle);
  }
}
