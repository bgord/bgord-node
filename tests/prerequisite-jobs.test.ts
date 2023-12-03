import { describe, test, expect } from 'vitest';
import {
  PrerequisiteStatusEnum,
  PrerequisiteStrategyEnum,
} from '../src/prerequisites';
import {
  PrerequisiteJobsStrategyConfigType,
  PrerequisiteJobsVerificator,
} from '../src/prerequisites/jobs';

describe('PrerequisiteJobsVerificator class', () => {
  test('verify method returns success for all jobs running', async () => {
    const config: PrerequisiteJobsStrategyConfigType = {
      label: 'All Jobs Running',
      strategy: PrerequisiteStrategyEnum.jobs,
      jobs: { a: { isRunning: () => true } as any },
    };

    const result = await PrerequisiteJobsVerificator.verify(config);

    expect(result).toBe(PrerequisiteStatusEnum.success);
  });

  test('verify method returns failure for at least one job not running', async () => {
    const config: PrerequisiteJobsStrategyConfigType = {
      label: 'At Least One Job Not Running',
      strategy: PrerequisiteStrategyEnum.jobs,
      jobs: {
        a: { isRunning: () => false } as any,
        b: { isRunning: () => true } as any,
      },
    };

    const result = await PrerequisiteJobsVerificator.verify(config);
    expect(result).toBe(PrerequisiteStatusEnum.failure);
  });
});
