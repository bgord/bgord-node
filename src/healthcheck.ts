import express from 'express';

import { Prerequisite, PrerequisiteStatusEnum } from './prerequisites';
import { Stopwatch } from './stopwatch';
import { Middleware } from './middleware';

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

      return response.status(code).send({ ok, details, ...stopwatch.stop() });
    }

    return Middleware(handle);
  }
}
