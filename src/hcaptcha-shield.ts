import express from 'express';
import hcaptcha from 'hcaptcha';
import { z } from 'zod';

import { HCaptchaSecretKey } from './schema';
import { AccessDeniedError, AccessDeniedErrorReasonType } from './errors';

import { Middleware } from './middleware';

type HCaptchaSecretKeyType = z.infer<typeof HCaptchaSecretKey>;

type HCaptchaVerifierModeType = 'local' | 'production';

export type HCaptchaVerifierConfigType = {
  secretKey: HCaptchaSecretKeyType;
  mode: HCaptchaVerifierModeType;
};

export class HCaptchaShield {
  private readonly secretKey: HCaptchaSecretKeyType;
  private readonly mode: HCaptchaVerifierModeType;

  private readonly LOCAL_HCAPTCHA_RESPONSE_PLACEHOLDER =
    '10000000-aaaa-bbbb-cccc-000000000001';

  constructor(config: HCaptchaVerifierConfigType) {
    this.mode = config.mode;
    this.secretKey = config.secretKey;
  }

  private async _verify(
    request: express.Request,
    _response: express.Response,
    next: express.NextFunction
  ) {
    try {
      const result = await hcaptcha.verify(
        this.secretKey,
        this.mode === 'production'
          ? request.body['h-captcha-response']
          : this.LOCAL_HCAPTCHA_RESPONSE_PLACEHOLDER
      );

      if (!result?.success) {
        throw new AccessDeniedError({
          reason: AccessDeniedErrorReasonType.hcaptcha,
        });
      }
      return next();
    } catch (error) {
      throw new AccessDeniedError({
        reason: AccessDeniedErrorReasonType.hcaptcha,
      });
    }
  }

  verify = Middleware(this._verify.bind(this));

  static helmetCspConfig = {
    'script-src': ['https://hcaptcha.com', 'https://*.hcaptcha.com'],
    'frame-src': ['https://hcaptcha.com', 'https://*.hcaptcha.com'],
    'style-src': ['https://hcaptcha.com', 'https://*.hcaptcha.com'],
    'connect-src': ['https://hcaptcha.com', 'https://*.hcaptcha.com'],
  };
}
