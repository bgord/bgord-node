import { MemoryConsumption } from '../memory-consumption';
import { Size } from '../size';

import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
  AbstractPrerequisite,
} from '../prerequisites';

export type PrerequisiteMemoryConfigType = {
  maximum: Size;
  label: PrerequisiteLabelType;
};

export class PrerequisiteMemory extends AbstractPrerequisite<
  PrerequisiteMemoryConfigType
> {
  readonly strategy = PrerequisiteStrategyEnum.memory;

  constructor(readonly config: PrerequisiteMemoryConfigType) {
    super(config);
  }

  async verify(): Promise<PrerequisiteStatusEnum> {
    const memoryConsumption = MemoryConsumption.get();

    if (memoryConsumption.isGreaterThan(this.config.maximum)) {
      return PrerequisiteStatusEnum.failure;
    }
    return PrerequisiteStatusEnum.success;
  }
}
