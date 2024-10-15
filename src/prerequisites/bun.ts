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
  current: string;
};

export class PrerequisiteBun extends AbstractPrerequisite<PrerequisiteBunConfigType> {
  readonly strategy = PrerequisiteStrategyEnum.bun;

  constructor(readonly config: PrerequisiteBunConfigType) {
    super(config);
  }

  async verify(): Promise<PrerequisiteStatusEnum> {
    const current = PackageVersion.fromString(this.config.current);

    if (current.isGreaterThanOrEqual(this.config.version)) {
      return this.pass();
    }
    return this.reject();
  }
}
