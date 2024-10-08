import "./polyfills";

import express from "express";
import bodyparser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import _ from "lodash";

import { MethodOverride } from "./method-override";
import { RequestId } from "./request-id";
import { ResponseBodyInLocals } from "./response-body-in-locals";
import { ServerTiming } from "./server-timing";
import { StaticFiles, StaticFilesConfigType } from "./static-files";
import { TimeZoneOffset } from "./time-zone-offset";
import { ApiVersion } from "./api-version";
import { HCaptchaShield } from "./hcaptcha-shield";
import { Context } from "./context";
import { ETagExtractor, WeakETagExtractor } from "./etag-extractor";
import { Size, SizeUnit } from "./size";
import { Stopwatch } from "./stopwatch";

export type ExpressEssentialsConfig = Partial<{
  helmet: Parameters<typeof helmet>[0];
  json: bodyparser.OptionsJson;
  urlencoded: bodyparser.OptionsUrlencoded;
  cors: cors.CorsOptions;
  staticFiles: StaticFilesConfigType;
}>;

declare global {
  namespace Express {
    interface Locals {
      // @ts-ignore
      startup: Stopwatch;
    }
  }
}

export const DEFAULT_HELMET_CONFIG = {
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "script-src": [
        "'self'",
        "'unsafe-inline'",
        ...HCaptchaShield.helmetCspConfig["script-src"],
      ],
      "script-src-attr": null,
      "style-src": [
        "'self'",
        "'unsafe-inline'",
        ...HCaptchaShield.helmetCspConfig["style-src"],
      ],
      "frame-src": [...HCaptchaShield.helmetCspConfig["frame-src"]],
      "connect-src": [
        "'self'",
        ...HCaptchaShield.helmetCspConfig["connect-src"],
      ],
      "img-src": ["'self'", "data:", "blob:"],
    },
  },
};

export function addExpressEssentials(
  app: express.Express,
  config?: ExpressEssentialsConfig
) {
  // @ts-ignore
  app.locals.startup = new Stopwatch();
  app.set("etag", false);
  const helmetConfig = config?.helmet ?? DEFAULT_HELMET_CONFIG;
  app.use(helmet(helmetConfig));
  app.use(ApiVersion.attach);

  const bodyParserJsonConfig = config?.json ?? {
    limit: new Size({ value: 128, unit: SizeUnit.kB }).toString(),
  };
  app.use(express.json(bodyParserJsonConfig));
  app.use(cookieParser() as express.RequestHandler);

  const bodyParserUrlencodedConfig = _.merge({}, config?.urlencoded ?? {}, {
    extended: true,
  });

  app.use(express.urlencoded(bodyParserUrlencodedConfig));

  const corsConfig = config?.cors ?? { origin: "*" };
  app.use(cors(corsConfig));

  const staticFilesConfig = config?.staticFiles ?? {};
  const staticFiles = new StaticFiles(staticFilesConfig);
  staticFiles.applyTo(app);

  MethodOverride.applyTo(app);
  TimeZoneOffset.applyTo(app);
  ServerTiming.applyTo(app);
  RequestId.applyTo(app);
  Context.applyTo(app);
  WeakETagExtractor.applyTo(app);
  ETagExtractor.applyTo(app);
  ResponseBodyInLocals.applyTo(app);
}
