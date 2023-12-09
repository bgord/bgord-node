import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
  AbstractPrerequisite,
} from '../prerequisites';

export type PrerequisiteSelfConfigType = {
  label: PrerequisiteLabelType;
};

export class PrerequisiteSelf extends AbstractPrerequisite<
  PrerequisiteSelfConfigType
> {
  readonly strategy = PrerequisiteStrategyEnum.self;

  constructor(readonly config: PrerequisiteSelfConfigType) {
    super(config);
  }

  async verify(): Promise<PrerequisiteStatusEnum> {
    return PrerequisiteStatusEnum.success;
  }
}
