import * as express from 'express';
import { Middleware } from './middleware';

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
