import path from 'path';
import checkDiskSpace from 'check-disk-space';

import { Size, SizeUnit } from '../size';
import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
} from '../prerequisites';

export type PrerequisiteSpaceStrategyConfigType = {
  label: PrerequisiteLabelType;
  strategy: PrerequisiteStrategyEnum.space;
  minimum: Size;
};

export class PrerequisiteSpaceVerificator {
  static async verify(
    config: PrerequisiteSpaceStrategyConfigType
  ): Promise<PrerequisiteStatusEnum> {
    const fsRoot = path.sep;
    const bytes = await checkDiskSpace(fsRoot);

    const freeDiskSpace = new Size({ unit: SizeUnit.b, value: bytes.free });

    if (freeDiskSpace.isGreaterThan(config.minimum)) {
      return PrerequisiteStatusEnum.success;
    }
    return PrerequisiteStatusEnum.failure;
  }
}
