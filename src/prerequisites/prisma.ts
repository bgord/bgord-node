import { PrismaClient } from '@prisma/client';

import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
  AbstractPrerequisite,
} from '../prerequisites';

export type PrerequisitePrismaConfigType = {
  client: PrismaClient;
  label: PrerequisiteLabelType;
  enabled?: boolean;
};

export class PrerequisitePrisma extends AbstractPrerequisite<
  PrerequisitePrismaConfigType
> {
  readonly strategy = PrerequisiteStrategyEnum.prisma;

  constructor(readonly config: PrerequisitePrismaConfigType) {
    super(config);
  }

  async verify(): Promise<PrerequisiteStatusEnum> {
    if (!this.enabled) return PrerequisiteStatusEnum.undetermined;

    try {
      const result = await this.config.client.$queryRaw`
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
