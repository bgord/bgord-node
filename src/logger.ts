import express from 'express';

import morgan from 'morgan';
import fs from 'fs';

type LogsFormatType = string;
type LogsFilenameType = string;

const defaultLogsFormat: LogsFormatType =
  ':remote-addr - [:date[clf]] ":method :url" :status :user-agent :response-time ms';

const defaultLogsFilename: LogsFilenameType = 'access.log';

export type LoggerConfig = {
  format: LogsFormatType;
  filename: LogsFilenameType;
};

export class Logger {
  logsFormat: LogsFormatType;
  logsFilename: LogsFilenameType;

  constructor(config?: LoggerConfig) {
    this.logsFormat = config?.format ?? defaultLogsFormat;
    this.logsFilename = config?.filename ?? defaultLogsFilename;
  }

  applyTo(app: express.Application): void {
    // Output logs to the console as well
    app.use(morgan(this.logsFormat));

    // Save logs to the file for later inspection
    app.use(
      morgan(this.logsFormat, {
        stream: fs.createWriteStream(this.logsFilename, {
          flags: 'a',
        }),
      })
    );
  }
}
