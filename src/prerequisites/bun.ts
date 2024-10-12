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
    console.log(this.config);
    if (!this.enabled) return PrerequisiteStatusEnum.undetermined;
    console.log("enabled");

    const { stdout } = await $`bun -v`;
    console.log(stdout);
    const current = PackageVersion.fromString(stdout);
    console.log(current);

    if (current.isGreaterThanOrEqual(this.config.version)) {
      console.log("passed");
      return this.pass();
    }
    console.log("rejected");
    return this.reject();
  }
}
