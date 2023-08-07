import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
} from '../prerequisites';

export type PrerequisiteSelfStrategyConfigType = {
  label: PrerequisiteLabelType;
  strategy: PrerequisiteStrategyEnum.self;
};

export class PrerequisiteSelfVerificator {
  static async verify(
    _config: PrerequisiteSelfStrategyConfigType
  ): Promise<PrerequisiteStatusEnum> {
    return PrerequisiteStatusEnum.success;
  }
}
