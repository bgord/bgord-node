import os from 'os';
import { Size, SizeUnit } from '../size';

import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
} from '../prerequisites';

export type PrerequisiteRAMStrategyConfigType = {
  label: PrerequisiteLabelType;
  strategy: PrerequisiteStrategyEnum.RAM;
  minimum: Size;
};

export class PrerequisiteRAMVerificator {
  static async verify(
    config: PrerequisiteRAMStrategyConfigType
  ): Promise<PrerequisiteStatusEnum> {
    const freeRAM = new Size({ unit: SizeUnit.b, value: os.freemem() });

    if (freeRAM.isGreaterThan(config.minimum)) {
      return PrerequisiteStatusEnum.success;
    }
    return PrerequisiteStatusEnum.failure;
  }
}
