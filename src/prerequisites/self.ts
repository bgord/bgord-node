import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
  AbstractPrerequisite,
} from '../prerequisites';

export type PrerequisiteSelfConfigType = {
  label: PrerequisiteLabelType;
  enabled?: boolean;
};

export class PrerequisiteSelf extends AbstractPrerequisite<
  PrerequisiteSelfConfigType
> {
  readonly strategy = PrerequisiteStrategyEnum.self;

  constructor(readonly config: PrerequisiteSelfConfigType) {
    super(config);
  }

  async verify(): Promise<PrerequisiteStatusEnum> {
    if (!this.enabled) return PrerequisiteStatusEnum.undetermined;
    return this.pass();
  }
}
