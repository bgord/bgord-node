import express from "express";

import {
  AuthorizationHeader,
  BasicAuthUsernameType,
  BasicAuthPasswordType,
} from "./schema";

type BasicAuthShieldConfigType = {
  username: BasicAuthUsernameType;
  password: BasicAuthPasswordType;
};

export class BasicAuthShield {
  constructor(private readonly config: BasicAuthShieldConfigType) {}

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

  verify = this._verify.bind(this);

  private reject(response: express.Response) {
    response.setHeader(
      "WWW-Authenticate",
      'Basic realm="Authentication Required"'
    );

    response.sendStatus(401);
  }
}
