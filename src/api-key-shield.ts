import * as express from 'express';

import * as Schema from './schema';
import { AccessDeniedError, AccessDeniedErrorReasonType } from './errors';

type ApiKeyShieldConfigType = { API_KEY: Schema.ApiKeyType };

export class ApiKeyShield {
  static readonly HEADER_NAME = 'bgord-api-key';

  constructor(private readonly config: ApiKeyShieldConfigType) {}

  private _verify(
    request: express.Request,
    _response: express.Response,
    next: express.NextFunction
  ) {
    if (request.headers[ApiKeyShield.HEADER_NAME] === this.config.API_KEY) {
      return next();
    }

    throw new AccessDeniedError({
      reason: AccessDeniedErrorReasonType['api-key'],
    });
  }

  verify = this._verify.bind(this);
}
