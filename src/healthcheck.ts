import express from 'express';

import { Prerequisite, PrerequisiteStatusEnum } from './prerequisites';
import { Middleware } from './middleware';

export class Healthcheck {
  static build(prerequisites: Prerequisite[]) {
    async function handle(
      _request: express.Request,
      response: express.Response,
      _next: express.NextFunction
    ) {
      for (const prerequisite of prerequisites) {
        await prerequisite.verify();
      }

      const details = prerequisites.map(prerequisite => ({
        label: prerequisite.config.label,
        status: prerequisite.status,
      }));

      const ok = details.every(
        result => result.status === PrerequisiteStatusEnum.success
      );

      const code = ok ? 200 : 424;

      return response.status(code).send({ ok, details });
    }

    return Middleware(handle);
  }
}
