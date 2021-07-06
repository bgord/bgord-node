import express from 'express';
import { verify as hcaptchaVerify } from 'hcaptcha';
import { z } from 'zod';

import { HCaptchaSecretKey } from './schema';
import { AccessDeniedError } from './errors';
import { ExpressEssentialsConfig } from './express-essentials';

type HCaptchaSecretKeyType = z.infer<typeof HCaptchaSecretKey>;

export type HCaptchaVerifierConfigType = {
  secretKey: HCaptchaSecretKeyType;
};

export class HCaptchaVerifier {
  secretKey: HCaptchaSecretKeyType;

  constructor(config: HCaptchaVerifierConfigType) {
    this.secretKey = config.secretKey;
  }

  verify() {
    const that = this;

    return async function(
      request: Parameters<express.RequestHandler>[0],
      _response: Parameters<express.RequestHandler>[1],
      next: Parameters<express.RequestHandler>[2]
    ) {
      try {
        const result = await hcaptchaVerify(
          that.secretKey,
          request.body['h-captcha-response']
        );

        if (!result?.success) {
          throw new AccessDeniedError();
        }

        return next();
      } catch (error) {
        throw new AccessDeniedError();
      }
    };
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
