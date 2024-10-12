import { createMiddleware } from "hono/factory";

import { ETag, WeakETag } from "../etag";

export type EtagVariables = { ETag: ETag | null; WeakETag: WeakETag | null };

export class ETagExtractor {
  static attach = createMiddleware<{ Variables: EtagVariables }>(
    async (c, next) => {
      try {
        const header = String(c.req.header(ETag.IF_MATCH_HEADER_NAME));

        if (!header || header === "undefined") c.set("ETag", null);
        else c.set("ETag", ETag.fromHeader(header));
      } catch (error) {
        c.set("ETag", null);
      }

      await next();
    }
  );
}

export class WeakETagExtractor {
  static attach = createMiddleware<{ Variables: EtagVariables }>(
    async (c, next) => {
      try {
        const header = String(c.req.header(WeakETag.IF_MATCH_HEADER_NAME));

        if (!header || header === "undefined") c.set("WeakETag", null);
        else c.set("WeakETag", ETag.fromHeader(header));
      } catch (error) {
        c.set("WeakETag", null);
      }

      await next();
    }
  );
}
