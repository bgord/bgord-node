import express from 'express';
import { Logger } from './logger';

import { Middleware } from './middleware';

export class HttpLogger {
  static applyTo(app: express.Application, logger: Logger): void {
    app.use(
      Middleware((request, response, next) => {
        const client = {
          ip: request.header('X-Real-IP') ?? request.ip,
          userAgent: request.header('user-agent'),
        };

        const httpRequestBeforeMetadata = {
          params: request.params,
          headers: request.headers,
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
          metadata: httpRequestBeforeMetadata,
        });

        response.on('finish', () => {
          const httpRequestAfterMetadata = {
            response: response.locals.body,
          };

          logger.http({
            operation: 'http_request_after',
            correlationId: request.requestId,
            message: 'response',
            method: request.method,
            url: `${request.header('host')}${request.url}`,
            responseCode: response.statusCode,
            client,
            metadata: httpRequestAfterMetadata,
          });
        });

        next();
      })
    );
  }
}
