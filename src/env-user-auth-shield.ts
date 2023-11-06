import express from 'express';
import passport from 'passport';
import { Strategy as PassportLocalStrategy } from 'passport-local';

import { noop } from './noop';
import { Middleware } from './middleware';
import * as Errors from './errors';

import { AdminUsernameType, AdminPasswordType } from './schema';

export type EnvUserAuthShieldConfigType = {
  ADMIN_USERNAME: AdminUsernameType;
  ADMIN_PASSWORD: AdminPasswordType;
};

export class EnvUserAuthShield {
  constructor(config: EnvUserAuthShieldConfigType) {
    passport.use(
      new PassportLocalStrategy(async (username, password, callback) => {
        if (username !== config.ADMIN_USERNAME) {
          return callback(new Errors.InvalidCredentialsError());
        }

        if (password !== config.ADMIN_PASSWORD) {
          return callback(new Errors.InvalidCredentialsError());
        }

        return callback(null, username);
      })
    );

    passport.serializeUser((user, callback) => callback(null, user));
    passport.deserializeUser((user, callback) =>
      callback(null, user as string)
    );
  }

  applyTo(app: express.Application): void {
    app.use(passport.initialize() as express.RequestHandler);
    app.use(passport.authenticate('session'));
  }

  attach = Middleware(passport.authenticate('local'));

  detach = Middleware(this._detach);

  verify = Middleware(this._verify);

  private async _verify(
    request: express.Request,
    _response: express.Response,
    next: express.NextFunction
  ) {
    if (request.isAuthenticated()) {
      return next();
    }

    throw new Errors.AccessDeniedError({
      reason: Errors.AccessDeniedErrorReasonType.auth,
    });
  }

  private async _detach(
    request: express.Request,
    _response: express.Response,
    next: express.NextFunction
  ) {
    request.logout({ keepSessionInfo: false }, noop);
    return next();
  }
}
