import { describe, test, expect } from 'vitest';

import * as Schema from '../src/schema';
import { FeatureFlag } from '../src/feature-flag';

describe('FeatureFlag', () => {
  test('isEnabled', () => {
    expect(FeatureFlag.isEnabled(Schema.FeatureFlagEnum.yes)).to.eq(true);
    expect(FeatureFlag.isEnabled(Schema.FeatureFlagEnum.no)).to.eq(false);
  });

  test('isDisabled', () => {
    expect(FeatureFlag.isDisabled(Schema.FeatureFlagEnum.yes)).to.eq(false);
    expect(FeatureFlag.isDisabled(Schema.FeatureFlagEnum.no)).to.eq(true);
  });
});
