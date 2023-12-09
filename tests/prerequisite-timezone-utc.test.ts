import { describe, test, expect } from 'vitest';

import { PrerequisiteStatusEnum } from '../src/prerequisites';
import { PrerequisiteTimezoneUTC } from '../src/prerequisites/timezone-utc';

describe('PrerequisiteTimezoneUTCVerificator class', () => {
  test('verify method returns success for valid timezone', async () => {
    const result = await new PrerequisiteTimezoneUTC({
      label: 'utc',
      timezone: 'UTC',
    }).verify();

    expect(result).toBe(PrerequisiteStatusEnum.success);
  });

  test('verify method returns failure for invalid timezone', async () => {
    const result = await new PrerequisiteTimezoneUTC({
      label: 'utc',
      timezone: 'InvalidTimezone',
    }).verify();

    expect(result).toBe(PrerequisiteStatusEnum.failure);
  });
});
