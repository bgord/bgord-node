import { ContextType } from "../context";
import { createMiddleware } from "hono/factory";

import * as Schema from "../schema";
import { TimeZoneOffsetVariables } from "./time-zone-offset";

export type ContextVariables = {
  context: ContextType;
  requestId: string;
} & TimeZoneOffsetVariables;

export class Context {
  static attach = <T extends { Variables: ContextVariables }>() =>
    createMiddleware<T>(async (c, next) => {
      c.set("context", {
        requestId: c.get("requestId") as Schema.CorrelationIdType,
        timeZoneOffset: c.get("timeZoneOffset"),
      });

      await next();
    });
}
