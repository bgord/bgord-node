import os from 'os';
import { Size, SizeUnit } from '../size';

import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
  AbstractPrerequisite,
} from '../prerequisites';

export type PrerequisiteRAMConfigType = {
  minimum: Size;
  label: PrerequisiteLabelType;
  enabled?: boolean;
};

export class PrerequisiteRAM extends AbstractPrerequisite<
  PrerequisiteRAMConfigType
> {
  readonly strategy = PrerequisiteStrategyEnum.RAM;

  constructor(readonly config: PrerequisiteRAMConfigType) {
    super(config);
  }

  async verify(): Promise<PrerequisiteStatusEnum> {
    if (!this.enabled) return PrerequisiteStatusEnum.undetermined;

    const freeRAM = new Size({ unit: SizeUnit.b, value: os.freemem() });

    if (freeRAM.isGreaterThan(this.config.minimum)) return this.pass();
    return this.reject();
  }
}
