import { $ } from "execa";
import { PackageVersion } from "../package-version";

import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
  AbstractPrerequisite,
} from "../prerequisites";

export type PrerequisiteBunConfigType = {
  version: PackageVersion;
  label: PrerequisiteLabelType;
  enabled?: boolean;
};

export class PrerequisiteBun extends AbstractPrerequisite<PrerequisiteBunConfigType> {
  readonly strategy = PrerequisiteStrategyEnum.bun;

  constructor(readonly config: PrerequisiteBunConfigType) {
    super(config);
  }

  async verify(): Promise<PrerequisiteStatusEnum> {
    if (!this.enabled) return PrerequisiteStatusEnum.undetermined;

    const { stdout } = await $`bun -v`;
    const current = PackageVersion.fromStringWithV(stdout);

    if (current.isGreaterThanOrEqual(this.config.version)) {
      return this.pass();
    }
    return this.reject();
  }
}
