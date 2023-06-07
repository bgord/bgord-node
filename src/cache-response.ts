import { Request, Response, NextFunction } from 'express';
import NodeCache from 'node-cache';

import { Middleware } from './middleware';

export enum CacheHitEnum {
  hit = 'hit',
  miss = 'miss',
}

export class CacheResponse {
  cache: NodeCache;

  static CACHE_HIT_HEADER = 'Cache-Hit';

  constructor(cache: NodeCache) {
    this.cache = cache;
  }

  private _handle(request: Request, response: Response, next: NextFunction) {
    if (this.cache.has(request.url)) {
      response.setHeader(CacheResponse.CACHE_HIT_HEADER, CacheHitEnum.hit);

      return response.status(200).send(this.cache.get(request.url));
    }

    response.setHeader(CacheResponse.CACHE_HIT_HEADER, CacheHitEnum.miss);

    return next();
  }

  handle = Middleware(this._handle.bind(this));

  private _clear(_request: Request, _response: Response, next: NextFunction) {
    this.cache.flushAll();

    return next();
  }

  clear = Middleware(this._clear.bind(this));
}
