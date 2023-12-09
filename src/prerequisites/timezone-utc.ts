import * as Schema from '../schema';
import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
  AbstractPrerequisite,
} from '../prerequisites';

export type PrerequisiteTimezoneUtcConfigType = {
  timezone: Schema.TimezoneType;
  label: PrerequisiteLabelType;
};

export class PrerequisiteTimezoneUTC extends AbstractPrerequisite<
  PrerequisiteTimezoneUtcConfigType
> {
  readonly strategy = PrerequisiteStrategyEnum.timezoneUTC;

  constructor(readonly config: PrerequisiteTimezoneUtcConfigType) {
    super(config);
  }

  async verify(): Promise<PrerequisiteStatusEnum> {
    try {
      Schema.TimezoneUTC.parse(this.config.timezone);
      return PrerequisiteStatusEnum.success;
    } catch (error) {
      return PrerequisiteStatusEnum.failure;
    }
  }
}
