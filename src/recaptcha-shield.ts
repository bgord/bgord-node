import express from 'express';
import { RecaptchaV3 } from 'express-recaptcha';

import { RecaptchaSiteKeyType, RecaptchaSecretKeyType } from './schema';
import { AccessDeniedError, AccessDeniedErrorReasonType } from './errors';

export type RecaptchaVerifierConfigType = {
  siteKey: RecaptchaSiteKeyType;
  secretKey: RecaptchaSecretKeyType;
};

export class RecaptchaShield {
  private readonly siteKey: RecaptchaVerifierConfigType['siteKey'];
  private readonly secretKey: RecaptchaVerifierConfigType['secretKey'];

  constructor(config: RecaptchaVerifierConfigType) {
    this.siteKey = config.siteKey;
    this.secretKey = config.secretKey;
  }

  build() {
    const recaptcha = new RecaptchaV3(this.siteKey, this.secretKey, {
      callback: 'cb',
    });

    return async function handler(
      request: express.Request,
      _response: express.Response,
      next: express.NextFunction
    ) {
      try {
        await new Promise((resolve, reject) =>
          recaptcha.verify(request, error => (error ? reject() : resolve(null)))
        );

        return next();
      } catch (error) {
        throw new AccessDeniedError({
          reason: AccessDeniedErrorReasonType.recaptcha,
        });
      }
    };
  }
}
