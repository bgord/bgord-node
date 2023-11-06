import { $ } from 'execa';

import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
} from '../prerequisites';

type PrerequisiteBinaryType = string;

export type PrerequisiteBinaryStrategyConfigType = {
  label: PrerequisiteLabelType;
  strategy: PrerequisiteStrategyEnum.binary;
  binary: PrerequisiteBinaryType;
};

export class PrerequisiteBinaryVerificator {
  static async verify(
    config: PrerequisiteBinaryStrategyConfigType
  ): Promise<PrerequisiteStatusEnum> {
    try {
      const result = await $`which ${config.binary}`;

      return result.exitCode === 0
        ? PrerequisiteStatusEnum.success
        : PrerequisiteStatusEnum.failure;
    } catch (error) {
      return PrerequisiteStatusEnum.failure;
    }
  }
}
