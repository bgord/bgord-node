import * as express from 'express';
import { NewUUID } from './uuid';

import { UUID } from './schema';
import { AccessDeniedError } from './errors';

import { Middleware } from './middleware';

declare module 'express-session' {
  interface SessionData {
    _csrf: CsrfShieldFieldValueType;
  }
}

type CsrfShieldFieldValueType = string;

export type CsrfShieldFieldType = {
  _csrf: CsrfShieldFieldValueType;
};

export class CsrfShield {
  static field = '_csrf';

  static async attach(
    request: express.Request,
    _response: express.Response,
    next: express.NextFunction
  ) {
    request.session._csrf = NewUUID.generate();
    return next();
  }

  static verify = Middleware(CsrfShield._verify);

  static async _verify(
    request: express.Request,
    _response: express.Response,
    next: express.NextFunction
  ) {
    try {
      const field = UUID.parse(request.session?._csrf);
      const match = UUID.parse(request.body?.[CsrfShield.field]);

      if (field === match) {
        return next();
      }
      throw new AccessDeniedError({
        reason: 'csrf',
      });
    } catch (error) {
      throw new AccessDeniedError({
        reason: 'csrf',
      });
    }
  }

  static extract(request: express.Request): CsrfShieldFieldType {
    const field = UUID.parse(request.session?._csrf);

    return { _csrf: field };
  }
}
