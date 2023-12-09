import { Mailer } from '../mailer';
import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
  AbstractPrerequisite,
} from '../prerequisites';

export type PrerequisiteMailerConfigType = {
  mailer: Mailer;
  label: PrerequisiteLabelType;
};

export class PrerequisiteMailer extends AbstractPrerequisite<
  PrerequisiteMailerConfigType
> {
  readonly strategy = PrerequisiteStrategyEnum.mailer;

  constructor(readonly config: PrerequisiteMailerConfigType) {
    super(config);
  }

  async verify(): Promise<PrerequisiteStatusEnum> {
    try {
      await this.config.mailer.verify();

      return PrerequisiteStatusEnum.success;
    } catch (error) {
      return PrerequisiteStatusEnum.failure;
    }
  }
}
