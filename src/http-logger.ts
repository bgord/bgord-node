import express from 'express';
import _ from 'lodash';

import { Logger } from './logger';
import { Middleware } from './middleware';
import { ServerTiming } from './server-timing';

export class HttpLogger {
  private static simplify(response: unknown) {
    const result = JSON.stringify(response, (_key, value) =>
      Array.isArray(value) ? { type: 'Array', length: value.length } : value
    );

    return JSON.parse(result);
  }

  private static uninformativeHeaders = [
    'accept',
    'accept-encoding',
    'cache-control',
    'connection',
    'content-length',
    'content-type',
    'cookie',
    'dnt',
    'host',
    'origin',
    'pragma',
    'sec-fetch-dest',
    'sec-fetch-mode',
    'sec-fetch-site',
    'sec-fetch-user',
    'sec-gpc',
    'upgrade-insecure-requests',
    'user-agent',
  ];

  static applyTo(app: express.Application, logger: Logger): void {
    app.use(
      Middleware((request, response, next) => {
        const client = {
          ip: request.header('X-Real-IP') ?? request.ip,
          userAgent: request.header('user-agent'),
        };

        const httpRequestBeforeMetadata = {
          params: request.params,
          headers: _.omit(request.headers, HttpLogger.uninformativeHeaders),
          body: request.body,
          query: request.query,
        };

        logger.http({
          operation: 'http_request_before',
          correlationId: request.requestId,
          message: 'request',
          method: request.method,
          url: `${request.header('host')}${request.url}`,
          client,
          metadata: _.pickBy(
            httpRequestBeforeMetadata,
            value => !_.isEmpty(value)
          ),
        });

        response.on('finish', () => {
          const httpRequestAfterMetadata = {
            response: response.locals.body,
          };

          const serverTimingMs = response.getHeader(ServerTiming.MS_HEADER);

          const durationMs = Number.isInteger(serverTimingMs)
            ? Number(serverTimingMs)
            : undefined;

          logger.http({
            operation: 'http_request_after',
            correlationId: request.requestId,
            message: 'response',
            method: request.method,
            url: `${request.header('host')}${request.url}`,
            responseCode: response.statusCode,
            durationMs,
            client,
            metadata: HttpLogger.simplify(httpRequestAfterMetadata),
          });
        });

        next();
      })
    );
  }
}
