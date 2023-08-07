import { PrismaClient } from '@prisma/client';
import execa from 'execa';
import { constants } from 'fs';
import fs from 'fs/promises';
import os from 'os';

import * as Schema from './schema';
import { Mailer } from './mailer';
import { PackageVersion } from './package-version';
import { Size, SizeUnit } from './size';

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

type PrerequisitePrismaStrategyConfigType = {
  label: PrerequisiteLabelType;
  strategy: PrerequisiteStrategyEnum.prisma;
  client: PrismaClient;
};

type PrerequisiteNodeStrategyConfigType = {
  label: PrerequisiteLabelType;
  strategy: PrerequisiteStrategyEnum.node;
  version: PackageVersion;
};

type PrerequisiteRAMStrategyConfigType = {
  label: PrerequisiteLabelType;
  strategy: PrerequisiteStrategyEnum.RAM;
  minimum: Size;
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

class PrerequisitePrismaVerificator {
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

class PrerequisiteNodeVerificator {
  static async verify(
    config: PrerequisiteNodeStrategyConfigType
  ): Promise<PrerequisiteStatusEnum> {
    const { stdout } = await execa('node', ['-v']);
    const current = PackageVersion.fromStringWithV(stdout);

    if (current.isGreaterThanOrEqual(config.version)) {
      return PrerequisiteStatusEnum.success;
    }
    return PrerequisiteStatusEnum.failure;
  }
}

class PrerequisiteRAMVerificator {
  static async verify(
    config: PrerequisiteRAMStrategyConfigType
  ): Promise<PrerequisiteStatusEnum> {
    const freeRAM = new Size({ unit: SizeUnit.b, value: os.freemem() });

    if (freeRAM.isGreaterThan(config.minimum)) {
      return PrerequisiteStatusEnum.success;
    }
    return PrerequisiteStatusEnum.failure;
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
