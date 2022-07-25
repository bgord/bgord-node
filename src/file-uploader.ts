import _ from 'lodash';
import express from 'express';
import files from 'express-form-data';
import os from 'os';

import { Middleware } from './middleware';

type FileUploaderConfigType = files.FormDataOptions;

export class FileUploader {
  static defaultConfig: FileUploaderConfigType = {
    uploadDir: os.tmpdir(),
    autoClean: true,
  };

  static applyTo(
    app: express.Application,
    config: FileUploaderConfigType
  ): void {
    app.use(files.parse(_.merge(FileUploader.defaultConfig, config)));
    app.use(files.format()); // filter our empty files
    app.use(files.union()); // copy files from req.files to req.body
  }

  static handle(config: FileUploaderConfigType = {}) {
    return [
      files.parse(_.merge(FileUploader.defaultConfig, config)),
      files.format(),
      files.union(),
    ].map(handler => Middleware(handler));
  }
}
