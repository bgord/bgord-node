import * as Schema from './schema';
import { Logger } from './logger';
import { NewUUID } from './uuid';

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
    const start = Date.now();

    const that = this;

    return async () => {
      try {
        that.logger.info({
          message: `${jobProcessor.label} start`,
          operation: 'job_start',
          correlationId,
        });

        await jobProcessor.process();

        const end = Date.now();

        that.logger.info({
          message: `${jobProcessor.label} success`,
          operation: 'job_success',
          correlationId,
          metadata: { durationMs: end - start },
        });
      } catch (error) {
        const end = Date.now();

        that.logger.error({
          message: `${jobProcessor.label} error`,
          operation: 'job_error',
          correlationId,
          metadata: {
            ...that.logger.formatError(error),
            durationMs: end - start,
          },
        });
      }
    };
  }
}
