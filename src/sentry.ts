import * as express from 'express';
import * as _Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

import { SentryDsnType } from './schema';

type Constructor<T> = new (...args: any[]) => T;

export class Sentry {
  private dsn: SentryDsnType;

  constructor(dsn: SentryDsnType) {
    this.dsn = dsn;
  }

  applyTo(app: express.Application): void {
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

  report<T extends Constructor<Error>>(
    app: express.Application,
    exclude: T[]
  ): void {
    app.use(
      _Sentry.Handlers.errorHandler({
        shouldHandleError(error) {
          return exclude.some(excluded => error instanceof excluded);
        },
      })
    );
  }
}
