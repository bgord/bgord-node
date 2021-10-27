import * as express from 'express';
import { AccessDeniedError } from './errors';

import { ApiKeyType } from './schema';

export class ApiKeyShield {
  static build(apiKey: ApiKeyType) {
    return function verify(
      request: express.Request,
      _response: express.Response,
      next: express.NextFunction
    ) {
      if (request.body.apiKey === apiKey) {
        return next();
      }

      throw new AccessDeniedError({ reason: 'general' });
    };
  }
}
