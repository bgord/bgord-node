import { $ } from 'execa';
import { PackageVersion } from '../package-version';

import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
} from '../prerequisites';

export type PrerequisiteNodeStrategyConfigType = {
  label: PrerequisiteLabelType;
  strategy: PrerequisiteStrategyEnum.node;
  version: PackageVersion;
};

export class PrerequisiteNodeVerificator {
  static async verify(
    config: PrerequisiteNodeStrategyConfigType
  ): Promise<PrerequisiteStatusEnum> {
    const { stdout } = await $`node -v`;
    const current = PackageVersion.fromStringWithV(stdout);

    if (current.isGreaterThanOrEqual(config.version)) {
      return PrerequisiteStatusEnum.success;
    }
    return PrerequisiteStatusEnum.failure;
  }
}
