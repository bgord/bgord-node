import execa from 'execa';

import { Mailer } from './mailer';

type PrerequisiteLabelType = string;
type PrerequisiteBinaryType = string;

export enum PrerequisiteStrategyEnum {
  exists = 'exists',
  mailer = 'mailer',
}

export enum PrerequisiteStatusEnum {
  success = 'success',
  failure = 'failure',
  undetermined = 'undetermined',
}

type PrerequisiteExistsStrategyConfigType = {
  label: PrerequisiteLabelType;
  strategy: PrerequisiteStrategyEnum.exists;
  binary: PrerequisiteBinaryType;
};

type PrerequisiteMailerStrategyConfigType = {
  label: PrerequisiteLabelType;
  strategy: PrerequisiteStrategyEnum.mailer;
  mailer: Mailer;
};

type PrerequisiteConfigType =
  | PrerequisiteExistsStrategyConfigType
  | PrerequisiteMailerStrategyConfigType;

export class Prerequisite {
  config: PrerequisiteConfigType;

  status: PrerequisiteStatusEnum = PrerequisiteStatusEnum.undetermined;

  constructor(config: PrerequisiteConfigType) {
    this.config = config;
  }

  async verify() {
    if (this.config.strategy === PrerequisiteStrategyEnum.exists) {
      this.status = await PrerequisiteExistsVerificator.verify(this.config);
      return;
    }

    if (this.config.strategy === PrerequisiteStrategyEnum.mailer) {
      this.status = await PrerequisiteMailerVerificator.verify(this.config);
      return;
    }

    throw new Error(`Unknown PrerequisiteStatusEnum value`);
  }

  report() {
    if (this.status === PrerequisiteStatusEnum.success) {
      console.log(
        `${this.config.label} verified correctly with ${this.config.strategy} strategy`
      );
    }

    if (this.status === PrerequisiteStatusEnum.failure) {
      console.log(
        `${this.config.label} not verified correctly with ${this.config.strategy} strategy`
      );
    }
  }
}

class PrerequisiteMailerVerificator {
  static async verify(
    config: PrerequisiteMailerStrategyConfigType
  ): Promise<PrerequisiteStatusEnum> {
    try {
      await config.mailer.verify();

      return PrerequisiteStatusEnum.success;
    } catch (error) {
      return PrerequisiteStatusEnum.failure;
    }
  }
}

class PrerequisiteExistsVerificator {
  static async verify(
    config: PrerequisiteExistsStrategyConfigType
  ): Promise<PrerequisiteStatusEnum> {
    try {
      const result = await execa('which', [config.binary]);

      return result.exitCode === 0
        ? PrerequisiteStatusEnum.success
        : PrerequisiteStatusEnum.failure;
    } catch (error) {
      return PrerequisiteStatusEnum.failure;
    }
  }
}

export class Prerequisites {
  static async check(prerequisites: Prerequisite[]) {
    try {
      const failedPrerequisiteLabels: PrerequisiteLabelType[] = [];

      for (const prerequisite of prerequisites) {
        await prerequisite.verify();
        prerequisite.report();

        if (prerequisite.status === PrerequisiteStatusEnum.failure) {
          failedPrerequisiteLabels.push(prerequisite.config.label);
        }
      }

      if (failedPrerequisiteLabels.length > 0) {
        const failedPrerequisiteLabelsFormatted = failedPrerequisiteLabels.join(
          ', '
        );

        console.log(
          `Prerequisites failed: ${failedPrerequisiteLabelsFormatted}, quitting...`,
          { quit: true }
        );
      }
    } catch (error) {
      console.log('Prerequisites error', String(error));
    }
  }
}
