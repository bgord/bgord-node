import express from 'express';

import { Middleware } from './middleware';

export class SimulatedError {
  static throw = Middleware(
    (
      _request: express.Request,
      _response: express.Response,
      _next: express.NextFunction
    ) => {
      throw new Error('Simulated error');
    }
  );
}
