import { Cron } from 'croner';

import * as Schema from './schema';
import { Logger } from './logger';
import { NewUUID } from './uuid';
import { Stopwatch } from './stopwatch';

export type JobNameType = string;
export type MultipleJobsType = Record<JobNameType, Cron>;

export class Jobs {
  static SCHEDULES = { EVERY_MINUTE: '* * * * *' };

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
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  handle(jobProcessor: JobProcessorType) {
    const correlationId = Schema.CorrelationId.parse(NewUUID.generate());
    const stopwatch = new Stopwatch();

    const that = this;

    return async () => {
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
