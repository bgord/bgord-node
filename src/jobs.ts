import { Cron } from 'croner';

import * as Schema from './schema';
import { Logger } from './logger';
import { NewUUID } from './uuid';
import { Stopwatch } from './stopwatch';

export type JobNameType = string;
export type MultipleJobsType = Record<JobNameType, Cron>;

export enum UTC_DAY_OF_THE_WEEK {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 0,
}

export class Jobs {
  static SCHEDULES = { EVERY_MINUTE: '* * * * *', EVERY_HOUR: '0 * * * *' };

  static stopAll(jobs: MultipleJobsType) {
    Object.values(jobs).forEach(job => job.stop());
  }

  static areAllRunning(jobs: MultipleJobsType): boolean {
    return Object.values(jobs).every(job => job.isRunning());
  }
}

export type JobProcessorType = {
  cron: string;
  label: JobNameType;
  process: () => Promise<void>;
};

export class JobHandler {
  constructor(private readonly logger: Logger) {}

  handle(jobProcessor: JobProcessorType) {
    const correlationId = Schema.CorrelationId.parse(NewUUID.generate());

    const that = this;

    return async () => {
      const stopwatch = new Stopwatch();

      try {
        that.logger.info({
          message: `${jobProcessor.label} start`,
          operation: 'job_start',
          correlationId,
        });

        await jobProcessor.process();

        that.logger.info({
          message: `${jobProcessor.label} success`,
          operation: 'job_success',
          correlationId,
          metadata: stopwatch.stop(),
        });
      } catch (error) {
        that.logger.error({
          message: `${jobProcessor.label} error`,
          operation: 'job_error',
          correlationId,
          metadata: {
            ...that.logger.formatError(error),
            ...stopwatch.stop(),
          },
        });
      }
    };
  }
}
