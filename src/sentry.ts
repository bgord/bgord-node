import * as express from 'express';
import * as _Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

import { SentryDsnType } from './schema';

type Constructor<T> = new (...args: any[]) => T;

type SentryConfig = {
  dsn: SentryDsnType;
  enabled: boolean;
};

export class Sentry {
  private dsn: SentryConfig['dsn'];
  enabled: SentryConfig['enabled'];

  constructor(config: SentryConfig) {
    this.dsn = config.dsn;
    this.enabled = config.enabled;
  }

  applyTo(app: express.Application): void {
    if (!this.enabled) {
      return;
    }

    _Sentry.init({
      dsn: this.dsn,
      integrations: [
        new _Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({ app }),
      ],
      tracesSampleRate: 1.0,
    });

    app.use(_Sentry.Handlers.requestHandler());
    app.use(_Sentry.Handlers.tracingHandler());
  }

  report(
    app: express.Application,
    handler: Parameters<typeof _Sentry.Handlers.errorHandler>[0]
  ): void {
    if (!this.enabled) {
      return;
    }

    app.use(_Sentry.Handlers.errorHandler(handler));
  }
}
