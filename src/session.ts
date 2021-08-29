import express from 'express';
import session from 'express-session';

type SessionConfigType = session.SessionOptions;

export class Session {
  config: SessionConfigType;

  constructor(config: SessionConfigType) {
    this.config = config;
  }

  applyTo(app: express.Application): void {
    const { secret, ...overrides } = this.config;

    app.use(
      session({
        secret,
        resave: false,
        saveUninitialized: true,
        name: 'bgord.sid',
        ...overrides,
      })
    );
  }
}
