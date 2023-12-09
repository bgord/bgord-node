import { constants } from 'fs';
import fsp from 'fs/promises';

import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
  AbstractPrerequisite,
} from '../prerequisites';

export type PrerequisitePathConfigType = {
  path: string;
  access?: { write?: boolean; execute?: boolean };
  label: PrerequisiteLabelType;
  enabled?: boolean;
};

export class PrerequisitePath extends AbstractPrerequisite<
  PrerequisitePathConfigType
> {
  readonly strategy = PrerequisiteStrategyEnum.path;

  constructor(readonly config: PrerequisitePathConfigType) {
    super(config);
  }

  async verify(): Promise<PrerequisiteStatusEnum> {
    if (!this.enabled) return PrerequisiteStatusEnum.undetermined;

    const write = this.config.access?.write ?? false;
    const execute = this.config.access?.execute ?? false;

    const flags =
      constants.R_OK |
      (write ? constants.W_OK : 0) |
      (execute ? constants.X_OK : 0);

    try {
      await fsp.access(this.config.path, flags);

      return PrerequisiteStatusEnum.success;
    } catch (error) {
      return PrerequisiteStatusEnum.failure;
    }
  }
}
