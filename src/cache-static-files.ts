import * as express from 'express';

import { Middleware } from './middleware';
import { Time } from './time';

export enum CacheStaticFilesStrategy {
  never = 'never',
  always = 'always',
  five_minutes = 'five_minutes',
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
          `public, max-age=${Time.Days(365).seconds}, immutable`
        );
      }
      if (strategy === CacheStaticFilesStrategy.five_minutes) {
        response.setHeader(
          'cache-control',
          `public, max-age=${Time.Minutes(5).seconds}`
        );
      }
      return next();
    }

    return Middleware(_handle);
  }
}
