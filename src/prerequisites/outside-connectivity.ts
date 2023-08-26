import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
} from '../prerequisites';

export type PrerequisiteOutsideConnectivityStrategyConfigType = {
  label: PrerequisiteLabelType;
  strategy: PrerequisiteStrategyEnum.outsideConnectivity;
};

export class PrerequisiteOutsideConnectivityVerificator {
  static async verify(
    _config: PrerequisiteOutsideConnectivityStrategyConfigType
  ): Promise<PrerequisiteStatusEnum> {
    try {
      const result = await fetch('https://google.com');

      return result.ok
        ? PrerequisiteStatusEnum.success
        : PrerequisiteStatusEnum.failure;
    } catch (error) {
      return PrerequisiteStatusEnum.failure;
    }
  }
}
