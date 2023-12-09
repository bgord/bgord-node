import execa from 'execa';
import { PackageVersion } from '../package-version';

import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
  AbstractPrerequisite,
} from '../prerequisites';

export type PrerequisiteNodeConfigType = {
  version: PackageVersion;
  label: PrerequisiteLabelType;
};

export class PrerequisiteNode extends AbstractPrerequisite<
  PrerequisiteNodeConfigType
> {
  readonly strategy = PrerequisiteStrategyEnum.node;

  constructor(readonly config: PrerequisiteNodeConfigType) {
    super(config);
  }

  async verify(): Promise<PrerequisiteStatusEnum> {
    const { stdout } = await execa('node', ['-v']);
    const current = PackageVersion.fromStringWithV(stdout);

    if (current.isGreaterThanOrEqual(this.config.version)) {
      return PrerequisiteStatusEnum.success;
    }
    return PrerequisiteStatusEnum.failure;
  }
}
