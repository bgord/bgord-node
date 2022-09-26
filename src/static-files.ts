import express from 'express';
import expressStaticGzip from 'express-static-gzip';
import * as Schema from './schema';

const defaultStaticFilesPathType = 'static';

type StaticGzipOptionsType = expressStaticGzip.ExpressStaticGzipOptions;

export type StaticFilesConfigType = Partial<
  { path: Schema.PathType } & StaticGzipOptionsType
>;

export class StaticFiles {
  path: Schema.PathType = Schema.Path.parse(defaultStaticFilesPathType);
  staticGzipOptions: StaticGzipOptionsType = {};

  constructor(config?: StaticFilesConfigType) {
    const { path, ...expressStaticGzipOptions } = config ?? {};

    this.path = Schema.Path.parse(path ?? defaultStaticFilesPathType);
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
