import express from 'express';

import { Reporter } from './reporter';

export class GracefulShutdown {
  static applyTo(
    server: ReturnType<express.Application['listen']>,
    callback?: Function
  ) {
    process.on('SIGTERM', async () => {
      Reporter.info('SIGTERM signal received: closing HTTP server');

      server.close(async () => {
        await callback?.();
        Reporter.info('HTTP server closed');
      });
    });

    process.on('SIGINT', async () => {
      Reporter.info('SIGINT signal received: closing HTTP server');

      server.close(async () => {
        await callback?.();
        Reporter.info('HTTP server closed');
      });
    });

    process.on('unhandledRejection', async () => {
      Reporter.info(
        'UnhandledPromiseRejectionWarning received: closing HTTP server'
      );

      server.close(async () => {
        await callback?.();
        Reporter.info('HTTP server closed');
      });
    });
  }
}
