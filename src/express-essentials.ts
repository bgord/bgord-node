import express from 'express';
import bodyparser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import _ from 'lodash';

import { MethodOverride } from './method-override';
import { RequestId } from './request-id';
import { ResponseBodyInLocals } from './response-body-in-locals';
import { ServerTiming } from './server-timing';
import { StaticFiles, StaticFilesConfigType } from './static-files';
import { TimeZoneOffset } from './time-zone-offset';
import { ApiVersion } from './api-version';

export type ExpressEssentialsConfig = Partial<{
  helmet: Parameters<typeof helmet>[0];
  json: bodyparser.OptionsJson;
  urlencoded: bodyparser.OptionsUrlencoded;
  cors: cors.CorsOptions;
  staticFiles: StaticFilesConfigType;
}>;

export function addExpressEssentials(
  app: express.Express,
  config?: ExpressEssentialsConfig
) {
  const helmetConfig = _.merge(
    {},
    {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'img-src': ["'self'", 'blob:'],
          'script-src': ["'self'", "'unsafe-inline'"],
          'script-src-attr': null,
        },
      },
    },
    config?.helmet ?? {}
  );
  app.use(helmet(helmetConfig));
  app.use(ApiVersion.attach);

  const bodyParserJsonConfig = config?.json ?? undefined;
  app.use(express.json(bodyParserJsonConfig));
  app.use(cookieParser());

  const bodyParserUrlencodedConfig = _.merge({}, config?.urlencoded ?? {}, {
    extended: true,
  });

  app.use(express.urlencoded(bodyParserUrlencodedConfig));

  const corsConfig = config?.cors ?? { origin: '*' };
  app.use(cors(corsConfig));

  const staticFilesConfig = config?.staticFiles ?? {};
  const staticFiles = new StaticFiles(staticFilesConfig);
  staticFiles.applyTo(app);

  MethodOverride.applyTo(app);
  TimeZoneOffset.applyTo(app);
  ServerTiming.applyTo(app);
  RequestId.applyTo(app);
  ResponseBodyInLocals.applyTo(app);
}
