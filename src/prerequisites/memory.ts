import { MemoryConsumption } from '../memory-consumption';
import { Size } from '../size';

import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
} from '../prerequisites';

export type PrerequisiteMemoryStrategyConfigType = {
  label: PrerequisiteLabelType;
  strategy: PrerequisiteStrategyEnum.memory;
  maximum: Size;
};

export class PrerequisiteMemoryVerificator {
  static async verify(
    config: PrerequisiteMemoryStrategyConfigType
  ): Promise<PrerequisiteStatusEnum> {
    const memoryConsumption = MemoryConsumption.get();

    if (memoryConsumption.isGreaterThan(config.maximum)) {
      return PrerequisiteStatusEnum.failure;
    }
    return PrerequisiteStatusEnum.success;
  }
}
