import express from 'express';
import session from 'express-session';
import FileStore from 'session-file-store';

type SessionConfigType = session.SessionOptions;

export class Session {
  config: SessionConfigType;

  static session = session;

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

export class SessionFileStore {
  static build(options: FileStore.Options = {}): session.Store {
    // @ts-ignore
    const Store = FileStore(Session.session);
    return new Store(options) as session.Store;
  }
}
