import * as Schema from "../schema";

import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

type ApiKeyShieldConfigType = { API_KEY: Schema.ApiKeyType };

export const AccessDeniedApiKeyError = new HTTPException(403, {
  message: "access_denied_api_key",
});

export class ApiKeyShield {
  static readonly HEADER_NAME = "bgord-api-key";

  constructor(private readonly config: ApiKeyShieldConfigType) {}

  verify = createMiddleware(async (c, next) => {
    if (c.req.header(ApiKeyShield.HEADER_NAME) === this.config.API_KEY) {
      return next();
    }

    throw AccessDeniedApiKeyError;
  });
}
