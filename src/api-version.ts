import express from 'express';

import { BuildInfoRepository } from './build-info-repository';

export class ApiVersion {
  static HEADER_NAME = 'api-version';

  static DEFAULT_API_VERSION = 'unknown';

  static attach = async (
    _request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const build = await BuildInfoRepository.extract();

    response.setHeader(
      ApiVersion.HEADER_NAME,
      build.BUILD_VERSION ?? ApiVersion.DEFAULT_API_VERSION
    );

    return next();
  };
}
