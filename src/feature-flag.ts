import * as Schema from './schema';

export class FeatureFlag {
  static isEnabled(flag: Schema.FeatureFlagType): boolean {
    return flag === Schema.FeatureFlagEnum.yes;
  }

  static isDisabled(flag: Schema.FeatureFlagType): boolean {
    return flag === Schema.FeatureFlagEnum.no;
  }
}
