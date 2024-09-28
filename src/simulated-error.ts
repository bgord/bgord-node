import express from 'express';

export class SimulatedError {
  static throw = (
    _request: express.Request,
    _response: express.Response,
    _next: express.NextFunction
  ) => {
    throw new Error('Simulated error');
  };
}
