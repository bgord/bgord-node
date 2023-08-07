import { Mailer } from './mailer';

import {
  PrerequisiteBinaryVerificator,
  PrerequisiteBinaryStrategyConfigType,
} from './prerequisites/prerequisite-binary';
import {
  PrerequisitePortVerificator,
  PrerequisitePortStrategyConfigType,
} from './prerequisites/prerequisite-port';
import {
  PrerequisiteTranslationsVerificator,
  PrerequisiteTranslationsStrategyConfigType,
} from './prerequisites/prerequisite-translations';
import {
  PrerequisiteSpaceVerificator,
  PrerequisiteSpaceStrategyConfigType,
} from './prerequisites/prerequisite-space';
import {
  PrerequisiteRAMVerificator,
  PrerequisiteRAMStrategyConfigType,
} from './prerequisites/prerequisite-ram';
import {
  PrerequisiteNodeVerificator,
  PrerequisiteNodeStrategyConfigType,
} from './prerequisites/prerequisite-node';
import {
  PrerequisitePrismaVerificator,
  PrerequisitePrismaStrategyConfigType,
} from './prerequisites/prerequisite-prisma';
import {
  PrerequisitePathVerificator,
  PrerequisitePathStrategyConfigType,
} from './prerequisites/prerequisite-path';
import {
  PrerequisiteTimezoneUTCVerificator,
  PrerequisiteTimezoneUtcStrategyConfigType,
} from './prerequisites/prerequisite-timezone-utc';

export type PrerequisiteLabelType = string;

export enum PrerequisiteStrategyEnum {
  binary = 'binary',
  mailer = 'mailer',
  self = 'self',
  timezoneUTC = 'timezoneUTC',
  path = 'path',
  prisma = 'prisma',
  node = 'node',
  RAM = 'RAM',
  space = 'space',
  translations = 'translations',
  port = 'port',
}

export enum PrerequisiteStatusEnum {
  success = 'success',
  failure = 'failure',
  undetermined = 'undetermined',
}

type PrerequisiteMailerStrategyConfigType = {
  label: PrerequisiteLabelType;
  strategy: PrerequisiteStrategyEnum.mailer;
  mailer: Mailer;
};

type PrerequisiteSelfStrategyConfigType = {
  label: PrerequisiteLabelType;
  strategy: PrerequisiteStrategyEnum.self;
};

type PrerequisiteConfigType =
  | PrerequisiteBinaryStrategyConfigType
  | PrerequisiteMailerStrategyConfigType
  | PrerequisiteSelfStrategyConfigType
  | PrerequisiteTimezoneUtcStrategyConfigType
  | PrerequisitePathStrategyConfigType
  | PrerequisitePrismaStrategyConfigType
  | PrerequisiteNodeStrategyConfigType
  | PrerequisiteRAMStrategyConfigType
  | PrerequisiteSpaceStrategyConfigType
  | PrerequisiteTranslationsStrategyConfigType
  | PrerequisitePortStrategyConfigType;

export class Prerequisite {
  config: PrerequisiteConfigType;

  status: PrerequisiteStatusEnum = PrerequisiteStatusEnum.undetermined;

  constructor(config: PrerequisiteConfigType) {
    this.config = config;
  }

  async verify(): Promise<PrerequisiteStatusEnum> {
    if (this.config.strategy === PrerequisiteStrategyEnum.binary) {
      const status = await PrerequisiteBinaryVerificator.verify(this.config);
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

    if (this.config.strategy === PrerequisiteStrategyEnum.prisma) {
      const status = await PrerequisitePrismaVerificator.verify(this.config);
      this.status = status;

      return status;
    }

    if (this.config.strategy === PrerequisiteStrategyEnum.node) {
      const status = await PrerequisiteNodeVerificator.verify(this.config);
      this.status = status;

      return status;
    }

    if (this.config.strategy === PrerequisiteStrategyEnum.RAM) {
      const status = await PrerequisiteRAMVerificator.verify(this.config);
      this.status = status;

      return status;
    }

    if (this.config.strategy === PrerequisiteStrategyEnum.space) {
      const status = await PrerequisiteSpaceVerificator.verify(this.config);
      this.status = status;

      return status;
    }

    if (this.config.strategy === PrerequisiteStrategyEnum.translations) {
      const status = await PrerequisiteTranslationsVerificator.verify(
        this.config
      );
      this.status = status;

      return status;
    }

    if (this.config.strategy === PrerequisiteStrategyEnum.port) {
      const status = await PrerequisitePortVerificator.verify(this.config);
      this.status = status;

      return status;
    }

    throw new Error(`Unknown PrerequisiteStatusEnum value`);
  }

  report() {
    if (this.status === PrerequisiteStatusEnum.success) {
      console.log(
        `[x] ${this.config.label} verified correctly with ${this.config.strategy} strategy`
      );
    }

    if (this.status === PrerequisiteStatusEnum.failure) {
      console.log(
        `[-] ${this.config.label} not verified correctly with ${this.config.strategy} strategy`
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

class PrerequisiteSelfVerificator {
  static async verify(
    _config: PrerequisiteSelfStrategyConfigType
  ): Promise<PrerequisiteStatusEnum> {
    return PrerequisiteStatusEnum.success;
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
