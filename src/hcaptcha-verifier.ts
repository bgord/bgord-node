import express from 'express';
import { verify as hcaptchaVerify } from 'hcaptcha';
import { z } from 'zod';

import { HCaptchaSecretKey } from './schema';
import { AccessDeniedError } from './errors';

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
        await hcaptchaVerify(
          that.secretKey,
          request.body.hCaptchaResponseToken
        );

        return next();
      } catch (error) {
        throw new AccessDeniedError();
      }
    };
  }
}
