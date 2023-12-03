import express from 'express';
import { describe, test, expect } from 'vitest';
import request from 'supertest';
import * as bg from '../src/session';

export const Session = new bg.Session({ secret: 'secret' });

import { CsrfShield } from '../src/csrf-shield';
import { Route } from '../src/route';

describe('CsrfShield middleware', () => {
  test('returns csrf token and validates it', async () => {
    const app = express();
    Session.applyTo(app);

    app.get(
      '/ping',
      CsrfShield.attach,
      Route((_request, response) =>
        response.status(200).send({ _csrf: _request.session._csrf })
      )
    );

    await request(app)
      .get('/ping')
      .expect(200)
      .expect(response => {
        expect(typeof response.body._csrf).toEqual('string');
        expect(response.body._csrf.length).toEqual(36);
      });
  });
});
