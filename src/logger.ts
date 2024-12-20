import * as winston from 'winston';

import * as Schema from './schema';
import { Size, SizeUnit } from './size';

type LogTimestampType = number;
type LogAppType = string;
type LogEnvironmentType = Schema.NodeEnvironmentEnum;
type LogMessageType = string;
type LogOperationType = string;
type LogMetadataType = Record<string, any>;
type LogCorrelationIdType = Schema.CorrelationIdType;

const levels: Record<Schema.LogLevelEnum, number> = {
  silent: 0,
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
  level: Schema.LogLevelEnum;
  message: LogMessageType;
  operation: LogOperationType;
  method: string;
  url: string;
  client: { ip?: string; userAgent?: string };
  correlationId?: LogCorrelationIdType;
  responseCode?: number;
  durationMs?: Schema.TimestampType;
  metadata?: LogMetadataType;
};

type LogErrorType = Omit<
  LogFullType,
  | 'app'
  | 'client'
  | 'environment'
  | 'duration'
  | 'level'
  | 'method'
  | 'responseCode'
  | 'timestamp'
  | 'url'
>;

type LogWarnType = Omit<
  LogFullType,
  | 'app'
  | 'client'
  | 'environment'
  | 'duration'
  | 'level'
  | 'method'
  | 'responseCode'
  | 'timestamp'
  | 'url'
>;

type LogInfoType = Omit<
  LogFullType,
  | 'app'
  | 'client'
  | 'environment'
  | 'duration'
  | 'level'
  | 'method'
  | 'responseCode'
  | 'timestamp'
  | 'url'
>;

type LogHttpType = Omit<
  LogFullType,
  'app' | 'environment' | 'timestamp' | 'level'
>;

type LoggerOptionsType = {
  app: LogAppType;
  environment: Schema.NodeEnvironmentEnum;
  level?: Schema.LogLevelEnum;
};

export class Logger {
  private readonly instance: winston.Logger;

  private readonly app: LoggerOptionsType['app'];

  private readonly environment: LoggerOptionsType['environment'];

  private readonly level: LoggerOptionsType['level'] =
    Schema.LogLevelEnum.verbose;

  constructor(options: LoggerOptionsType) {
    this.app = options.app;
    this.environment = options.environment;
    this.level = options.level ?? this.level;

    const formats = [
      winston.format.json(),

      this.environment !== Schema.NodeEnvironmentEnum.production
        ? winston.format.prettyPrint()
        : undefined,
    ].filter(Boolean);

    this.instance = winston.createLogger({
      level: this.level,
      levels,
      handleExceptions: true,
      handleRejections: true,
      format: winston.format.combine(
        ...(formats as NonNullable<winston.LoggerOptions['format']>[])
      ),
      transports: [new winston.transports.Console()],
    });

    if (this.environment === Schema.NodeEnvironmentEnum.production) {
      this.instance.add(
        new winston.transports.File({
          filename: `/var/log/${this.app}-${this.environment}.log`,
          maxsize: Size.toBytes({ unit: SizeUnit.MB, value: 100 }),
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
      level: Schema.LogLevelEnum.info,
      ...this.getBase(),
      ...log,
    });
  }

  error(log: LogErrorType) {
    this.instance.error({
      level: Schema.LogLevelEnum.error,
      ...this.getBase(),
      ...log,
    });
  }

  warn(log: LogWarnType) {
    this.instance.warn({
      level: Schema.LogLevelEnum.warn,
      ...this.getBase(),
      ...log,
    });
  }

  http(log: LogHttpType) {
    this.instance.http({
      level: Schema.LogLevelEnum.http,
      ...this.getBase(),
      ...log,
    });
  }

  formatError(_error: unknown) {
    const error = _error as Error;

    return {
      message: error?.message,
      name: error?.name,
      stack: error?.stack,
    };
  }
}
