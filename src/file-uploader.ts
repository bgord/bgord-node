import _ from 'lodash';
import express from 'express';
import files from 'express-form-data';
import os from 'os';

import { Middleware } from "./middleware";

type FileUploaderConfigType = files.FormDataOptions;

const defaultConfig: FileUploaderConfigType = {
  uploadDir: os.tmpdir(),
  autoClean: true,
};

export class FileUploader {
  config: FileUploaderConfigType = defaultConfig;

  constructor(config: FileUploaderConfigType = {}) {
    this.config = _.merge(this.config, config);
  }

  applyTo(app: express.Application): void {
    app.use(files.parse(this.config));
    app.use(files.format()); // filter our empty files
    app.use(files.union()); // copy files from req.files to req.body
  }

  handle(config: FileUploaderConfigType = {}) {
    return [
      files.parse(_.merge(this.config, config)),
      files.format(),
      files.union(),
    ].map(handler => Middleware(handler));
}
