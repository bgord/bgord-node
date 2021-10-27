import express from 'express';

import expressStaticGzip from 'express-static-gzip';

type StaticFilesPathType = string;
const defaultStaticFilesPathType = 'static';

export type StaticFilesConfigType = Partial<{
  path: StaticFilesPathType;
}>;

export class StaticFiles {
  path: StaticFilesPathType = defaultStaticFilesPathType;

  constructor(config?: StaticFilesConfigType) {
    if (config?.path) {
      this.path = config?.path;
    }
  }

  applyTo(app: express.Application): void {
    app.use(
      '/',
      expressStaticGzip(this.path, {
        index: false,
        enableBrotli: true,
        orderPreference: ['br'],
      })
    );
  }
}
