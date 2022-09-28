import express from 'express';
import { sleep } from './sleep';
import { Middleware } from './middleware';

type SlowerConfigType = { delayMs?: number };

export class Slower {
  static build(config: SlowerConfigType) {
    async function verify(
      _request: express.Request,
      _response: express.Response,
      next: express.NextFunction
    ) {
      const delay = config.delayMs ?? 500;
      await sleep(delay);

      next();
    }

    return Middleware(verify);
  }
}
