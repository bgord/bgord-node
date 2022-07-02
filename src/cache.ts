import * as express from 'express';
import { Middleware } from './middleware';

export enum CacheStrategy {
  never = 'never',
  always = 'always',
}

export class Cache {
  static handle(strategy: CacheStrategy) {
    function _handle(
      _request: express.Request,
      response: express.Response,
      next: express.NextFunction
    ) {
      if (strategy === CacheStrategy.never) {
        response.setHeader(
          'cache-control',
          'private, no-cache, no-store, must-revalidate'
        );
      }
      if (strategy === CacheStrategy.always) {
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
