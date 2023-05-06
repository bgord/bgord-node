import * as winston from 'winston';

import * as Schema from './schema';
import * as VO from './value-objects';

enum LogLevelTypeEnum {
  error = 'error',
  warn = 'warn',
  info = 'info',
  http = 'http',
  verbose = 'verbose',
}

type LogTimestampType = number;
type LogAppType = string;
type LogEnvironmentType = string;
type LogMessageType = string;
type LogOperationType = string;
type LogMetadataType = Record<string, any>;
type LogRequestIdType = Schema.RequestIdType;

const levels: Record<LogLevelTypeEnum, number> = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
};

type LogFullType = {
  timestamp: LogTimestampType;
  app: LogAppType;
  environment: LogEnvironmentType;
  level: LogLevelTypeEnum;
  message: LogMessageType;
  operation: LogOperationType;
  method: string;
  url: string;
  client: { ip: string; userAgent?: string };
  requestId?: LogRequestIdType;
  responseCode?: number;
  metadata?: LogMetadataType;
};

type LogErrorType = Omit<
  LogFullType,
  | 'timestamp'
  | 'app'
  | 'environment'
  | 'level'
  | 'method'
  | 'url'
  | 'client'
  | 'responseCode'
>;

type LogInfoType = Omit<
  LogFullType,
  | 'app'
  | 'environment'
  | 'timestamp'
  | 'level'
  | 'method'
  | 'url'
  | 'responseCode'
  | 'client'
  | 'requestId'
>;

type LogHttpType = Omit<
  LogFullType,
  'app' | 'environment' | 'timestamp' | 'level'
>;

export class Logger {
  private instance: winston.Logger;

  private app: string;

  private environment: string;

  constructor(base: { app: string; environment: Schema.NodeEnvironmentEnum }) {
    this.app = base.app;
    this.environment = base.environment;

    this.instance = winston.createLogger({
      level: LogLevelTypeEnum.verbose,
      levels,
      handleExceptions: true,
      handleRejections: true,
      format: winston.format.combine(winston.format.json()),
      transports: [new winston.transports.Console()],
    });

    if (this.environment !== Schema.NodeEnvironmentEnum.local) {
      this.instance.add(
        new winston.transports.File({
          filename: `/var/log/${this.app}-${this.environment}.log`,
          maxsize: VO.FileSize.toBytes({
            unit: VO.FileSizeUnit.MB,
            value: 10,
          }),
        })
      );
    }
  }

  private getBase() {
    return {
      app: this.app,
      environment: this.environment,
      timestamp: Date.now(),
    };
  }

  info(log: LogInfoType) {
    this.instance.info({
      level: LogLevelTypeEnum.info,
      ...this.getBase(),
      ...log,
    });
  }

  error(log: LogErrorType) {
    this.instance.error({
      level: LogLevelTypeEnum.error,
      ...this.getBase(),
      ...log,
    });
  }

  http(log: LogHttpType) {
    this.instance.http({
      level: LogLevelTypeEnum.http,
      ...this.getBase(),
      ...log,
    });
  }
}
