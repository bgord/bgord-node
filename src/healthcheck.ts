import express from 'express';

import {
  Prerequisite,
  PrerequisiteStatusEnum,
  PrerequisiteLabelType,
} from './prerequisites';
import { Stopwatch, StopwatchResultType } from './stopwatch';
import { Uptime, UptimeResultType } from './uptime';
import { Middleware } from './middleware';

type HealthcheckResultType = {
  ok: PrerequisiteStatusEnum;
  uptime: UptimeResultType;
  details: { label: PrerequisiteLabelType; status: PrerequisiteStatusEnum }[];
} & StopwatchResultType;

export class Healthcheck {
  static build(prerequisites: Prerequisite[]) {
    async function handle(
      _request: express.Request,
      response: express.Response,
      _next: express.NextFunction
    ) {
      const stopwatch = new Stopwatch();

      const details = [];

      for (const prerequisite of prerequisites) {
        const status = await prerequisite.verify();
        details.push({ label: prerequisite.config.label, status });
      }

      const ok = details.every(
        result => result.status === PrerequisiteStatusEnum.success
      )
        ? PrerequisiteStatusEnum.success
        : PrerequisiteStatusEnum.failure;

      const code = ok ? 200 : 424;

      const result: HealthcheckResultType = {
        ok,
        uptime: Uptime.get(),
        details,
        ...stopwatch.stop(),
      };

      return response.status(code).send(result);
    }

    return Middleware(handle);
  }
}
