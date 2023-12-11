import execa from 'execa';

import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
  AbstractPrerequisite,
} from '../prerequisites';

export type PrerequisiteMigrationsConfigType = {
  label: PrerequisiteLabelType;
  enabled?: boolean;
};

export class PrerequisiteMigrations extends AbstractPrerequisite<
  PrerequisiteMigrationsConfigType
> {
  readonly strategy = PrerequisiteStrategyEnum.migrations;

  constructor(readonly config: PrerequisiteMigrationsConfigType) {
    super(config);
  }

  async verify(): Promise<PrerequisiteStatusEnum> {
    if (!this.enabled) return PrerequisiteStatusEnum.undetermined;

    try {
      const result = await execa.command(`npx prisma migrate status`);

      return result.exitCode === 0 ? this.pass() : this.reject();
    } catch (error) {
      return this.reject();
    }
  }
}
