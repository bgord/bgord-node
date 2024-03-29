import { $ } from 'execa';
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
  enabled?: boolean;
};

export class PrerequisiteNode extends AbstractPrerequisite<
  PrerequisiteNodeConfigType
> {
  readonly strategy = PrerequisiteStrategyEnum.node;

  constructor(readonly config: PrerequisiteNodeConfigType) {
    super(config);
  }

  async verify(): Promise<PrerequisiteStatusEnum> {
    if (!this.enabled) return PrerequisiteStatusEnum.undetermined;

    const { stdout } = await $`node -v`;
    const current = PackageVersion.fromStringWithV(stdout);

    if (current.isGreaterThanOrEqual(this.config.version)) {
      return this.pass();
    }
    return this.reject();
  }
}
