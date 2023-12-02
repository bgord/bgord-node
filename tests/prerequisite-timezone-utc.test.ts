import { describe, test, expect } from 'vitest';

import {
  PrerequisiteStatusEnum,
  PrerequisiteStrategyEnum,
} from '../src/prerequisites';
import {
  PrerequisiteTimezoneUTCVerificator,
  PrerequisiteTimezoneUtcStrategyConfigType,
} from '../src/prerequisites/timezone-utc';

describe('PrerequisiteTimezoneUTCVerificator class', () => {
  test('verify method returns success for valid timezone', async () => {
    const validConfig: PrerequisiteTimezoneUtcStrategyConfigType = {
      label: 'Valid Timezone',
      strategy: PrerequisiteStrategyEnum.timezoneUTC,
      timezone: 'UTC',
    };

    const result = await PrerequisiteTimezoneUTCVerificator.verify(validConfig);

    expect(result).toBe(PrerequisiteStatusEnum.success);
  });

  test('verify method returns failure for invalid timezone', async () => {
    const invalidConfig: PrerequisiteTimezoneUtcStrategyConfigType = {
      label: 'Invalid Timezone',
      strategy: PrerequisiteStrategyEnum.timezoneUTC,
      timezone: 'InvalidTimezone',
    };

    const result = await PrerequisiteTimezoneUTCVerificator.verify(
      invalidConfig
    );

    expect(result).toBe(PrerequisiteStatusEnum.failure);
  });
});
