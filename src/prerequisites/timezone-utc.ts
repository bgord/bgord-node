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
  enabled?: boolean;
};

export class PrerequisiteTimezoneUTC extends AbstractPrerequisite<
  PrerequisiteTimezoneUtcConfigType
> {
  readonly strategy = PrerequisiteStrategyEnum.timezoneUTC;

  constructor(readonly config: PrerequisiteTimezoneUtcConfigType) {
    super(config);
  }

  async verify(): Promise<PrerequisiteStatusEnum> {
    if (!this.enabled) return PrerequisiteStatusEnum.undetermined;

    try {
      Schema.TimezoneUTC.parse(this.config.timezone);
      return this.pass();
    } catch (error) {
      return this.reject();
    }
  }
}
