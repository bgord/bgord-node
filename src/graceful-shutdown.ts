import express from 'express';

import { noop } from './noop';

type ServerType = ReturnType<express.Application['listen']>;

export class GracefulShutdown {
  private static async shutdown(server: ServerType, callback: Function = noop) {
    server.close(async () => {
      await callback();
      console.log('HTTP server closed');
    });
  }

  static applyTo(server: ServerType, callback: Function = noop) {
    process.on('SIGTERM', async () => {
      console.log('SIGTERM signal received: closing HTTP server');
      await GracefulShutdown.shutdown(server, callback);
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT signal received: closing HTTP server');
      await GracefulShutdown.shutdown(server, callback);
      process.exit(0);
    });

    process.on('unhandledRejection', async event => {
      console.log(
        'UnhandledPromiseRejectionWarning received: closing HTTP server'
      );

      /* eslint-disable no-console */
      console.log(JSON.stringify(event));

      await GracefulShutdown.shutdown(server, callback);
      process.exit(1);
    });
  }
}
