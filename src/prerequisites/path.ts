import { constants } from 'fs';
import fsp from 'fs/promises';

import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
} from '../prerequisites';

export type PrerequisitePathStrategyConfigType = {
  label: PrerequisiteLabelType;
  strategy: PrerequisiteStrategyEnum.path;
  path: string;
  access?: { write?: boolean; execute?: boolean };
};

export class PrerequisitePathVerificator {
  static async verify(
    config: PrerequisitePathStrategyConfigType
  ): Promise<PrerequisiteStatusEnum> {
    const write = config.access?.write ?? false;
    const execute = config.access?.execute ?? false;

    const flags =
      constants.R_OK |
      (write ? constants.W_OK : 0) |
      (execute ? constants.X_OK : 0);

    try {
      await fsp.access(config.path, flags);

      return PrerequisiteStatusEnum.success;
    } catch (error) {
      return PrerequisiteStatusEnum.failure;
    }
  }
}
