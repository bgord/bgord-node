import express from 'express';
import { sleep } from './sleep';

type SlowerConfigType = { ms?: number };

export class Slower {
  static build(config?: SlowerConfigType) {
    return async function handle(
      _request: express.Request,
      _response: express.Response,
      next: express.NextFunction
    ) {
      const ms = config?.ms ?? 500;
      await sleep({ ms });

      next();
    };
  }
}
