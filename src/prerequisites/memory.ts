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
  enabled?: boolean;
};

export class PrerequisiteMemory extends AbstractPrerequisite<
  PrerequisiteMemoryConfigType
> {
  readonly strategy = PrerequisiteStrategyEnum.memory;

  constructor(readonly config: PrerequisiteMemoryConfigType) {
    super(config);
  }

  async verify(): Promise<PrerequisiteStatusEnum> {
    if (!this.enabled) return PrerequisiteStatusEnum.undetermined;

    const memoryConsumption = MemoryConsumption.get();

    if (memoryConsumption.isGreaterThan(this.config.maximum)) {
      return this.reject();
    }
    return this.pass();
  }
}
