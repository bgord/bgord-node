import express from 'express';

import { Middleware } from './middleware';
import {
  AuthorizationHeader,
  BasicAuthUsernameType,
  BasicAuthPasswordType,
} from './schema';

type BasicAuthShieldConfigType = {
  username: BasicAuthUsernameType;
  password: BasicAuthPasswordType;
};

export class BasicAuthShield {
  config: BasicAuthShieldConfigType;

  constructor(config: BasicAuthShieldConfigType) {
    this.config = config;
  }

  private _verify(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    const authorization = AuthorizationHeader.safeParse(
      request.headers.authorization
    );

    if (!authorization.success) return this.reject(response);

    if (
      this.config.username !== authorization.data.username ||
      this.config.password !== authorization.data.password
    ) {
      return this.reject(response);
    }

    return next();
  }

  verify = Middleware(this._verify.bind(this));

  private reject(response: express.Response) {
    response.setHeader(
      'WWW-Authenticate',
      'Basic realm="Authentication Required"'
    );

    return response.sendStatus(401);
  }
}
