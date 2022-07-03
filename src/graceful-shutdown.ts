import express from 'express';

import { Reporter } from './reporter';
import { noop } from './noop';

type ServerType = ReturnType<express.Application['listen']>;

export class GracefulShutdown {
  private static async shutdown(server: ServerType, callback: Function = noop) {
    server.close(async () => {
      await callback();
      Reporter.info('HTTP server closed');
    });
  }

  static applyTo(server: ServerType, callback: Function = noop) {
    process.on('SIGTERM', async () => {
      Reporter.info('SIGTERM signal received: closing HTTP server');
      await GracefulShutdown.shutdown(server, callback);
    });

    process.on('SIGINT', async () => {
      Reporter.info('SIGINT signal received: closing HTTP server');
      await GracefulShutdown.shutdown(server, callback);
    });

    process.on('unhandledRejection', async event => {
      Reporter.info(
        'UnhandledPromiseRejectionWarning received: closing HTTP server'
      );

      /* eslint-disable no-console */
      console.log(JSON.stringify(event));

      await GracefulShutdown.shutdown(server, callback);
    });
  }
}
