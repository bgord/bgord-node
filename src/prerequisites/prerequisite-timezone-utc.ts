import * as Schema from '../schema';
import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
} from '../prerequisites';

export type PrerequisiteTimezoneUtcStrategyConfigType = {
  label: PrerequisiteLabelType;
  strategy: PrerequisiteStrategyEnum.timezoneUTC;
  timezone: Schema.TimezoneType;
};

export class PrerequisiteTimezoneUTCVerificator {
  static async verify(
    config: PrerequisiteTimezoneUtcStrategyConfigType
  ): Promise<PrerequisiteStatusEnum> {
    try {
      Schema.TimezoneUTC.parse(config.timezone);
      return PrerequisiteStatusEnum.success;
    } catch (error) {
      return PrerequisiteStatusEnum.failure;
    }
  }
}
