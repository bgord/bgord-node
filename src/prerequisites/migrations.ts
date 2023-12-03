import execa from 'execa';

import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
} from '../prerequisites';

export type PrerequisiteMigrationsStrategyConfigType = {
  label: PrerequisiteLabelType;
  strategy: PrerequisiteStrategyEnum.migrations;
};

export class PrerequisiteMigrationsVerificator {
  static async verify(
    _config: PrerequisiteMigrationsStrategyConfigType
  ): Promise<PrerequisiteStatusEnum> {
    try {
      const result = await execa.command(`npx prisma migrate status`);

      return result.exitCode === 0
        ? PrerequisiteStatusEnum.success
        : PrerequisiteStatusEnum.failure;
    } catch (error) {
      return PrerequisiteStatusEnum.failure;
    }
  }
}
