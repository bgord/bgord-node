import execa from 'execa';
import { constants } from 'fs';
import fs from 'fs/promises';

import * as Schema from './schema';
import { Mailer } from './mailer';

type PrerequisiteLabelType = string;
type PrerequisiteBinaryType = string;

export enum PrerequisiteStrategyEnum {
  exists = 'exists',
  mailer = 'mailer',
  self = 'self',
  timezoneUTC = 'timezoneUTC',
  path = 'path',
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

type PrerequisiteSelfStrategyConfigType = {
  label: PrerequisiteLabelType;
  strategy: PrerequisiteStrategyEnum.self;
};

type PrerequisiteTimezoneUtcStrategyConfigType = {
  label: PrerequisiteLabelType;
  strategy: PrerequisiteStrategyEnum.timezoneUTC;
  timezone: Schema.TimezoneType;
};

type PrerequisitePathStrategyConfigType = {
  label: PrerequisiteLabelType;
  strategy: PrerequisiteStrategyEnum.path;
  path: string;
  access?: { write?: boolean; execute?: boolean };
};

type PrerequisiteConfigType =
  | PrerequisiteExistsStrategyConfigType
  | PrerequisiteMailerStrategyConfigType
  | PrerequisiteSelfStrategyConfigType
  | PrerequisiteTimezoneUtcStrategyConfigType
  | PrerequisitePathStrategyConfigType;

export class Prerequisite {
  config: PrerequisiteConfigType;

  status: PrerequisiteStatusEnum = PrerequisiteStatusEnum.undetermined;

  constructor(config: PrerequisiteConfigType) {
    this.config = config;
  }

  async verify(): Promise<PrerequisiteStatusEnum> {
    if (this.config.strategy === PrerequisiteStrategyEnum.exists) {
      const status = await PrerequisiteExistsVerificator.verify(this.config);
      this.status = status;

      return status;
    }

    if (this.config.strategy === PrerequisiteStrategyEnum.mailer) {
      const status = await PrerequisiteMailerVerificator.verify(this.config);
      this.status = status;

      return status;
    }

    if (this.config.strategy === PrerequisiteStrategyEnum.self) {
      const status = await PrerequisiteSelfVerificator.verify(this.config);
      this.status = status;

      return status;
    }

    if (this.config.strategy === PrerequisiteStrategyEnum.timezoneUTC) {
      const status = await PrerequisiteTimezoneUTCVerificator.verify(
        this.config
      );
      this.status = status;

      return status;
    }

    if (this.config.strategy === PrerequisiteStrategyEnum.path) {
      const status = await PrerequisitePathVerificator.verify(this.config);
      this.status = status;

      return status;
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

class PrerequisiteSelfVerificator {
  static async verify(
    _config: PrerequisiteSelfStrategyConfigType
  ): Promise<PrerequisiteStatusEnum> {
    return PrerequisiteStatusEnum.success;
  }
}

class PrerequisiteTimezoneUTCVerificator {
  static async verify(
    config: PrerequisiteTimezoneUtcStrategyConfigType
  ): Promise<PrerequisiteStatusEnum> {
    try {
      Schema.TimezoneUTC.parse(config.timezone);
      return PrerequisiteStatusEnum.success;
    } catch (error) {
      return PrerequisiteStatusEnum.failure;
    }
  }
}

class PrerequisitePathVerificator {
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
      await fs.access(config.path, flags);

      return PrerequisiteStatusEnum.success;
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
          `Prerequisites failed: ${failedPrerequisiteLabelsFormatted}, quitting...`
        );

        process.exit(1);
      }
    } catch (error) {
      console.log('Prerequisites error', String(error));
    }
  }
}
