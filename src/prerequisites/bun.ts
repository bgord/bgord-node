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
    // biome-ignore lint: lint/suspicious/noConsoleLog
    console.log(this.config);
    if (!this.enabled) return PrerequisiteStatusEnum.undetermined;
    // biome-ignore lint: lint/suspicious/noConsoleLog
    console.log("enabled");

    const { stdout } = await $`bun -v`;
    // biome-ignore lint: lint/suspicious/noConsoleLog
    console.log(stdout);
    const current = PackageVersion.fromString(stdout);
    // biome-ignore lint: lint/suspicious/noConsoleLog
    console.log(current);

    if (current.isGreaterThanOrEqual(this.config.version)) {
      // biome-ignore lint: lint/suspicious/noConsoleLog
      console.log("passed");
      return this.pass();
    }
    // biome-ignore lint: lint/suspicious/noConsoleLog
    console.log("rejected");
    return this.reject();
  }
}
