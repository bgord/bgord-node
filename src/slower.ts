import express from 'express';
import { sleep } from './sleep';
import { Middleware } from './middleware';

type SlowerConfigType = { delayMs?: number };

export class Slower {
  static build(config: SlowerConfigType) {
    async function handle(
      _request: express.Request,
      _response: express.Response,
      next: express.NextFunction
    ) {
      const delayMs = config.delayMs ?? 500;
      await sleep({ ms: delayMs });

      next();
    }

    return Middleware(handle);
  }
}
