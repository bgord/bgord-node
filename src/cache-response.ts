import { Request, Response, NextFunction } from 'express';
import NodeCache from 'node-cache';
import _ from 'lodash';

export enum CacheHitEnum {
  hit = 'hit',
  miss = 'miss',
}

export class CacheResponse {
  static readonly CACHE_HIT_HEADER = 'Cache-Hit';

  constructor(private readonly cache: NodeCache) {}

  private _handle(request: Request, response: Response, next: NextFunction) {
    const url = _.escape(request.url);

    if (this.cache.has(url)) {
      response.setHeader(CacheResponse.CACHE_HIT_HEADER, CacheHitEnum.hit);

      response.status(200).send(this.cache.get(url));
    }

    response.setHeader(CacheResponse.CACHE_HIT_HEADER, CacheHitEnum.miss);

    return next();
  }

  handle = this._handle.bind(this);

  private _clear(_request: Request, _response: Response, next: NextFunction) {
    this.cache.flushAll();

    return next();
  }

  clear = this._clear.bind(this);
}
