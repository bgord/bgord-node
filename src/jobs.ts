import * as Schema from './schema';
import { Logger } from './logger';
import { NewUUID } from './uuid';
import { Stopwatch } from './stopwatch';

export class Jobs {
  static SCHEDULES = { EVERY_MINUTE: '* * * * *' };

  static stopAll(jobs: Record<string, { stop: VoidFunction }>) {
    Object.values(jobs).forEach(job => job.stop());
  }
}

export type JobProcessorType = {
  cron: string;
  label: string;
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
