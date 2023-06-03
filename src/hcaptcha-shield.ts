import express from 'express';
import { verify as hcaptchaVerify } from 'hcaptcha';
import { z } from 'zod';

import { HCaptchaSecretKey } from './schema';
import { AccessDeniedError, AccessDeniedErrorReasonType } from './errors';
import { ExpressEssentialsConfig } from './express-essentials';

import { Middleware } from './middleware';

type HCaptchaSecretKeyType = z.infer<typeof HCaptchaSecretKey>;

type HCaptchaVerifierModeType = 'local' | 'production';

export type HCaptchaVerifierConfigType = {
  secretKey: HCaptchaSecretKeyType;
  mode: HCaptchaVerifierModeType;
};

export class HCaptchaShield {
  secretKey: HCaptchaSecretKeyType;
  mode: HCaptchaVerifierModeType;

  constructor(config: HCaptchaVerifierConfigType) {
    this.mode = config.mode;
    this.secretKey = config.secretKey;
  }

  build() {
    const that = this;

    async function handler(
      request: express.Request,
      _response: express.Response,
      next: express.NextFunction
    ) {
      try {
        const result = await hcaptchaVerify(
          that.secretKey,
          that.mode === 'production'
            ? request.body['h-captcha-response']
            : '10000000-aaaa-bbbb-cccc-000000000001'
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

    return Middleware(handler);
  }

  static helmetCspConfig: ExpressEssentialsConfig['helmet'] = {
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'script-src': ['https://hcaptcha.com', 'https://*.hcaptcha.com'],
        'frame-src': ['https://hcaptcha.com', 'https://*.hcaptcha.com'],
        'style-src': ['https://hcaptcha.com', 'https://*.hcaptcha.com'],
        'connect-src': ['https://hcaptcha.com', 'https://*.hcaptcha.com'],
      },
    },
  };
}
