import { PrismaClient } from '@prisma/client';

import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
} from '../prerequisites';

export type PrerequisitePrismaStrategyConfigType = {
  label: PrerequisiteLabelType;
  strategy: PrerequisiteStrategyEnum.prisma;
  client: PrismaClient;
};

export class PrerequisitePrismaVerificator {
  static async verify(
    config: PrerequisitePrismaStrategyConfigType
  ): Promise<PrerequisiteStatusEnum> {
    try {
      const result = await config.client.$queryRaw`
        SELECT name
        FROM sqlite_master
        WHERE type='table'
        ORDER BY name;
      `;

      if (Array.isArray(result) && result.length > 0) {
        return PrerequisiteStatusEnum.success;
      }
      return PrerequisiteStatusEnum.failure;
    } catch (error) {
      return PrerequisiteStatusEnum.failure;
    }
  }
}
