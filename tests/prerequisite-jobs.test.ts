import { describe, test, expect } from 'vitest';
import { PrerequisiteStatusEnum } from '../src/prerequisites';
import { PrerequisiteJobs } from '../src/prerequisites/jobs';

describe('PrerequisiteJobs class', () => {
  test('verify method returns success for all jobs running', async () => {
    const result = await new PrerequisiteJobs({
      label: 'jobs',
      jobs: { a: { isRunning: () => true } as any },
    }).verify();

    expect(result).toBe(PrerequisiteStatusEnum.success);
  });

  test('verify method returns failure for at least one job not running', async () => {
    const result = await new PrerequisiteJobs({
      label: 'jobs',
      jobs: {
        a: { isRunning: () => false } as any,
        b: { isRunning: () => true } as any,
      },
    }).verify();

    expect(result).toBe(PrerequisiteStatusEnum.failure);
  });
});
