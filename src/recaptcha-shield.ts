import express from 'express';
import { RecaptchaV3 } from 'express-recaptcha';

import { RecaptchaSiteKeyType, RecaptchaSecretKeyType } from './schema';
import { AccessDeniedError } from './errors';
import { Middleware } from './middleware';

export type RecaptchaVerifierConfigType = {
  siteKey: RecaptchaSiteKeyType;
  secretKey: RecaptchaSecretKeyType;
};

export class RecaptchaShield {
  siteKey: RecaptchaVerifierConfigType['siteKey'];
  secretKey: RecaptchaVerifierConfigType['secretKey'];

  constructor(config: RecaptchaVerifierConfigType) {
    this.siteKey = config.siteKey;
    this.secretKey = config.secretKey;
  }

  build() {
    const recaptcha = new RecaptchaV3(this.siteKey, this.secretKey, {
      callback: 'cb',
    });

    async function handler(
      request: express.Request,
      _response: express.Response,
      next: express.NextFunction
    ) {
      try {
        return recaptcha.verify(request, () => {
          if (!request?.recaptcha?.error) {
            return next();
          } else {
            throw new AccessDeniedError({ reason: 'recaptcha' });
          }
        });
      } catch (error) {
        throw new AccessDeniedError({ reason: 'recaptcha' });
      }
    }

    return Middleware(handler);
  }
}
