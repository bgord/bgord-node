import { describe, test, expect } from 'vitest';
import {
  PrerequisiteStatusEnum,
  PrerequisiteStrategyEnum,
} from '../src/prerequisites';
import {
  PrerequisiteSelfStrategyConfigType,
  PrerequisiteSelfVerificator,
} from '../src/prerequisites/self';

describe('PrerequisiteSelfVerificator class', () => {
  test('verify method returns success for self strategy', async () => {
    const selfConfig: PrerequisiteSelfStrategyConfigType = {
      label: 'Self Prerequisite',
      strategy: PrerequisiteStrategyEnum.self,
    };

    const result = await PrerequisiteSelfVerificator.verify(selfConfig);

    expect(result).toBe(PrerequisiteStatusEnum.success);
  });
});
