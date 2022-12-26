import * as express from 'express';
import { PrismaClient } from '@prisma/client';

import { Middleware } from './middleware';
import { Prerequisite, PrerequisiteStatusEnum } from './prerequisites';

type HealthcheckComponentLabelType = string;

type HealthcheckComponentResponse = {
  label: HealthcheckComponentLabelType;
  status: HealthcheckComponentStatus;
};

export enum HealthcheckComponentStatus {
  working = 'working',
  failed = 'failed',
}

export interface HealthcheckComponent {
  verify(): Promise<HealthcheckComponentResponse>;
}

export class HealthcheckAutoresponder implements HealthcheckComponent {
  async verify() {
    return {
      label: 'autoresponder',
      status: HealthcheckComponentStatus.working,
    };
  }
}

export class HealthcheckPrerequisite implements HealthcheckComponent {
  prerequisite: Prerequisite;

  constructor(prerequisite: Prerequisite) {
    this.prerequisite = prerequisite;
  }

  async verify() {
    const result = await this.prerequisite.verify();

    if (result.status === PrerequisiteStatusEnum.success) {
      return {
        label: result.config.label,
        status: HealthcheckComponentStatus.working,
      };
    }

    return {
      label: result.config.label,
      status: HealthcheckComponentStatus.failed,
    };
  }
}

export class HealthcheckPrisma implements HealthcheckComponent {
  db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async verify() {
    try {
      await this.db.$queryRawUnsafe(
        `SELECT * FROM healthcheck ORDER BY ROWID ASC LIMIT 1`
      );

      return {
        label: 'prisma',
        status: HealthcheckComponentStatus.working,
      };
    } catch (error) {
      return {
        label: 'prisma',
        status: HealthcheckComponentStatus.failed,
      };
    }
  }
}

export class Healthcheck {
  static verify(components: HealthcheckComponent[]) {
    async function verify(
      _request: express.Request,
      response: express.Response,
      _next: express.NextFunction
    ) {
      const report = await Promise.all(
        components.map(component => component.verify())
      );

      const isEveryComponentWorking = report.every(
        component => component.status === HealthcheckComponentStatus.working
      );

      if (isEveryComponentWorking) {
        return response.status(200).send(report);
      }

      return response.status(500).send(report);
    }

    return Middleware(verify);
  }
}
