import express from 'express';
import bodyparser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import _ from 'lodash';

import { Logger, LoggerConfigType } from './logger';
import { StaticFiles, StaticFilesConfigType } from './static-files';

export type ExpressEssentialsConfig = Partial<{
  helmet: Parameters<typeof helmet>[0];
  json: bodyparser.OptionsJson;
  urlencoded: bodyparser.OptionsUrlencoded;
  cors: cors.CorsOptions;
  logger: LoggerConfigType;
  staticFiles: StaticFilesConfigType;
}>;

export function addExpressEssentials(
  app: express.Express,
  config?: ExpressEssentialsConfig
) {
  const helmetConfig = config?.helmet ?? undefined;
  app.use(helmet(helmetConfig));

  const bodyParserJsonConfig = config?.json ?? undefined;
  app.use(express.json(bodyParserJsonConfig));

  const bodyParserUrlencodedConfig = _.merge(config?.urlencoded ?? {}, {
    extended: true,
  });

  app.use(express.urlencoded(bodyParserUrlencodedConfig));

  const corsConfig = config?.cors ?? { origin: '*' };
  app.use(cors(corsConfig));

  const loggerConfig = config?.logger ?? {};
  const logger = new Logger(loggerConfig);
  logger.applyTo(app);

  const staticFilesConfig = config?.staticFiles ?? {};
  const staticFiles = new StaticFiles(staticFilesConfig);
  staticFiles.applyTo(app);
}
