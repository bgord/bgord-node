import _ from 'lodash';
import express from 'express';
import files from 'express-form-data';
import os from 'os';

import { UploadedFile } from './schema';
import { NotAcceptedMimeError } from './errors';
import { Mime } from './mime';
import { Middleware } from './middleware';

type FileUploaderConfigType = files.FormDataOptions & { mimeTypes: string[] };

export class FileUploader {
  static defaultConfig: FileUploaderConfigType = {
    uploadDir: os.tmpdir(),
    autoClean: true,
    mimeTypes: [Mime.wildcard],
  };

  static applyTo(
    app: express.Application,
    _config: FileUploaderConfigType
  ): void {
    const config = _.merge({}, FileUploader.defaultConfig, _config);

    app.use(files.parse(config));
    app.use(files.format()); // filter out empty files
    app.use(files.union()); // copy files from req.files to req.body
    app.use(FileUploader.validate(config));
  }

  static handle(_config: FileUploaderConfigType = FileUploader.defaultConfig) {
    const config = _.merge({}, FileUploader.defaultConfig, _config);

    return [
      files.parse(config),
      files.format(),
      files.union(),
      FileUploader.validate(config),
    ].map(handler => Middleware(handler));
  }

  private static validate(config: FileUploaderConfigType) {
    return (
      request: express.Request,
      _response: express.Response,
      next: express.NextFunction
    ) => {
      const file = UploadedFile.parse(request.body?.file);
      const contentType = new Mime(file.headers['content-type']);

      const accepted = config.mimeTypes.some(acceptedMimeType =>
        new Mime(acceptedMimeType).isSatisfiedBy(contentType)
      );

      if (!accepted) {
        throw new NotAcceptedMimeError(contentType.raw);
      }

      next();
    };
  }
}
