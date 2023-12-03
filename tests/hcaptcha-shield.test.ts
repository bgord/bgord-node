import express from 'express';
import { describe, test, expect, vi } from 'vitest';
import request from 'supertest';
import hcaptcha from 'hcaptcha';
import {
  HCaptchaShield,
  HCaptchaVerifierConfigType,
} from '../src/hcaptcha-shield';
import { AccessDeniedError } from '../src/errors';

describe('HCaptchaShield middleware', () => {
  test('verifies hCaptcha successfully', async () => {
    const spy = vi
      .spyOn(hcaptcha, 'verify')
      .mockResolvedValue({ success: true });

    const app = express();
    app.use(express.json());

    const config: HCaptchaVerifierConfigType = {
      secretKey: 'valid-secret-key',
      mode: 'production',
    };
    const middleware = new HCaptchaShield(config);

    app.post('/submit', middleware.verify, (_request, response) =>
      response.status(200).send('Verified successfully!')
    );

    const result = await request(app)
      .post('/submit')
      .send({ 'h-captcha-response': 'valid-response-token' })
      .expect(200);

    expect(result.text).toBe('Verified successfully!');

    spy.mockRestore();
  });

  test('handles hCaptcha verification failure', async () => {
    const spy = vi
      .spyOn(hcaptcha, 'verify')
      .mockResolvedValue({ success: false });

    const app = express();
    app.use(express.json());

    const config: HCaptchaVerifierConfigType = {
      secretKey: 'invalid-secret-key',
      mode: 'production',
    };
    const middleware = new HCaptchaShield(config);

    app.post(
      '/submit',
      middleware.verify,
      () => expect.unreachable(),
      (error, _request, response, _next) => {
        if (error instanceof AccessDeniedError) {
          return response.status(403).send('hcaptcha error');
        }
        expect.unreachable();
      }
    );

    const result = await request(app)
      .post('/submit')
      .send({ 'h-captcha-response': 'invalid-response-token' })
      .expect(403);

    expect(result.text).toEqual('hcaptcha error');

    spy.mockRestore();
  });
});
