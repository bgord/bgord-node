import * as express from 'express';

import { AccessDeniedError } from './errors';
import { ApiKeyType } from './schema';

import { Middleware } from './middleware';

export class ApiKeyShield {
  static build(apiKey: ApiKeyType) {
    function verify(
      request: express.Request,
      _response: express.Response,
      next: express.NextFunction
    ) {
      if (request.body.apiKey === apiKey) {
        return next();
      }

      throw new AccessDeniedError({ reason: 'api-key' });
    }

    return Middleware(verify);
  }
}
