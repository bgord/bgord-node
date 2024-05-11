import express from 'express';

import { noop } from './noop';

type ServerType = ReturnType<express.Application['listen']>;

export class GracefulShutdown {
  // biome-ignore lint: lint/complexity/noBannedTypes
  private static async shutdown(server: ServerType, callback: Function = noop) {
    server.close(async () => {
      await callback();
      // biome-ignore lint: lint/suspicious/noConsoleLog
      console.log('HTTP server closed');
    });
  }

  // biome-ignore lint: lint/complexity/noBannedTypes
  static applyTo(server: ServerType, callback: Function = noop) {
    process.on('SIGTERM', async () => {
      // biome-ignore lint: lint/suspicious/noConsoleLog
      console.log('SIGTERM signal received: closing HTTP server');
      await GracefulShutdown.shutdown(server, callback);
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      // biome-ignore lint: lint/suspicious/noConsoleLog
      console.log('SIGINT signal received: closing HTTP server');
      await GracefulShutdown.shutdown(server, callback);
      process.exit(0);
    });

    process.on('unhandledRejection', async event => {
      // biome-ignore lint: lint/suspicious/noConsoleLog
      console.log(
        'UnhandledPromiseRejectionWarning received: closing HTTP server'
      );

      // biome-ignore lint: lint/suspicious/noConsoleLog
      console.log(JSON.stringify(event));

      await GracefulShutdown.shutdown(server, callback);
      process.exit(1);
    });
  }
}
