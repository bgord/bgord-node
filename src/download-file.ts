import express from 'express';
import fs from 'node:fs';

import { Mime } from './mime';

export type DownloadFileConfigType = { filename: fs.PathLike; mime: Mime };

export class DownloadFile {
  static attach(response: express.Response, config: DownloadFileConfigType) {
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${config.filename}"`
    );
    response.setHeader('Content-Type', config.mime.raw);
  }
}
