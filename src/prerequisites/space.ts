import path from 'path';
import checkDiskSpace from 'check-disk-space';

import { Size, SizeUnit } from '../size';
import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
  AbstractPrerequisite,
} from '../prerequisites';

export type PrerequisiteSpaceConfigType = {
  minimum: Size;
  label: PrerequisiteLabelType;
  enabled?: boolean;
};

export class PrerequisiteSpace extends AbstractPrerequisite<
  PrerequisiteSpaceConfigType
> {
  readonly strategy = PrerequisiteStrategyEnum.space;

  constructor(readonly config: PrerequisiteSpaceConfigType) {
    super(config);
  }

  async verify(): Promise<PrerequisiteStatusEnum> {
    if (!this.enabled) return PrerequisiteStatusEnum.undetermined;

    const fsRoot = path.sep;
    const bytes = await checkDiskSpace(fsRoot);

    const freeDiskSpace = new Size({ unit: SizeUnit.b, value: bytes.free });

    if (freeDiskSpace.isGreaterThan(this.config.minimum)) {
      return PrerequisiteStatusEnum.success;
    }
    return PrerequisiteStatusEnum.failure;
  }
}
