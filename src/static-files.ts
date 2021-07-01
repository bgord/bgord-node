import express from 'express';

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
    app.use(express.static(this.path));
  }
}
