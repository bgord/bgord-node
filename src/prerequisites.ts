import execa from 'execa';
import { Reporter } from './reporter';

type PrerequisiteLabelType = string;
type PrerequisiteBinaryType = string;

export enum PrerequisiteStrategyEnum {
  exists = 'exists',
}

enum PrerequisiteStatusEnum {
  success = 'success',
  failure = 'failure',
  undetermined = 'undetermined',
}

type PrerequisiteExistsStrategyConfigType = {
  label: PrerequisiteLabelType;
  strategy: PrerequisiteStrategyEnum.exists;
  binary: PrerequisiteBinaryType;
};

type PrerequisiteConfigType = PrerequisiteExistsStrategyConfigType;

export class Prerequisite {
  config: PrerequisiteConfigType;

  status: PrerequisiteStatusEnum = PrerequisiteStatusEnum.undetermined;

  constructor(config: PrerequisiteConfigType) {
    this.config = config;
  }

  async verify() {
    try {
      const result = await execa('which', [this.config.binary]);

      this.status =
        result.exitCode === 0
          ? PrerequisiteStatusEnum.success
          : PrerequisiteStatusEnum.failure;

      return this;
    } catch (error) {
      this.status = PrerequisiteStatusEnum.failure;
      return this;
    }
  }

  report() {
    if (this.status === PrerequisiteStatusEnum.success) {
      Reporter.success(
        `${this.config.label} verified correctly with ${this.config.strategy} strategy`
      );
    }

    if (this.status === PrerequisiteStatusEnum.failure) {
      Reporter.success(
        `${this.config.label} not verified correctly with ${this.config.strategy} strategy`
      );
    }
  }
}

export class Prerequisites {
  static async check(prerequisites: Prerequisite[]) {
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

      Reporter.error(
        `Prerequisites failed: ${failedPrerequisiteLabelsFormatted}, quitting...`,
        { quit: true }
      );
    }
  }
}
