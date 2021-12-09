import express from 'express';

import expressStaticGzip from 'express-static-gzip';

type StaticFilesPathType = string;
const defaultStaticFilesPathType = 'static';

type StaticGzipOptionsType = expressStaticGzip.ExpressStaticGzipOptions;

export type StaticFilesConfigType = Partial<
  { path: StaticFilesPathType } & StaticGzipOptionsType
>;

export class StaticFiles {
  path: StaticFilesPathType = defaultStaticFilesPathType;
  staticGzipOptions: StaticGzipOptionsType = {};

  constructor(config?: StaticFilesConfigType) {
    const { path, ...expressStaticGzipOptions } = config ?? {};

    this.path = path ?? defaultStaticFilesPathType;
    this.staticGzipOptions = expressStaticGzipOptions;
  }

  applyTo(app: express.Application): void {
    app.use(
      '/',
      expressStaticGzip(this.path, {
        index: false,
        enableBrotli: true,
        orderPreference: ['br'],
        ...this.staticGzipOptions,
      })
    );
  }
}
