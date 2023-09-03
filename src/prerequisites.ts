import * as P from './prerequisites/index';

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
  migrations = 'migrations',
  jobs = 'jobs',
  memory = 'memory',
  outsideConnectivity = 'outsideConnectivity',
  sslCertificateExpiry = 'sslCertificateExpiry',
}

export enum PrerequisiteStatusEnum {
  success = 'success',
  failure = 'failure',
  undetermined = 'undetermined',
}

type PrerequisiteConfigType =
  | P.PrerequisiteBinaryStrategyConfigType
  | P.PrerequisiteMailerStrategyConfigType
  | P.PrerequisiteSelfStrategyConfigType
  | P.PrerequisiteTimezoneUtcStrategyConfigType
  | P.PrerequisitePathStrategyConfigType
  | P.PrerequisitePrismaStrategyConfigType
  | P.PrerequisiteNodeStrategyConfigType
  | P.PrerequisiteRAMStrategyConfigType
  | P.PrerequisiteSpaceStrategyConfigType
  | P.PrerequisiteTranslationsStrategyConfigType
  | P.PrerequisitePortStrategyConfigType
  | P.PrerequisiteMigrationsStrategyConfigType
  | P.PrerequisiteJobsStrategyConfigType
  | P.PrerequisiteMemoryStrategyConfigType
  | P.PrerequisiteOutsideConnectivityStrategyConfigType
  | P.PrerequisiteSSLCertificateExpiryStrategyConfigType;

export class Prerequisite {
  config: PrerequisiteConfigType;

  status: PrerequisiteStatusEnum = PrerequisiteStatusEnum.undetermined;

  constructor(config: PrerequisiteConfigType) {
    this.config = config;
  }

  async verify(): Promise<PrerequisiteStatusEnum> {
    if (this.config.strategy === PrerequisiteStrategyEnum.binary) {
      const status = await P.PrerequisiteBinaryVerificator.verify(this.config);
      this.status = status;

      return status;
    }

    if (this.config.strategy === PrerequisiteStrategyEnum.mailer) {
      const status = await P.PrerequisiteMailerVerificator.verify(this.config);
      this.status = status;

      return status;
    }

    if (this.config.strategy === PrerequisiteStrategyEnum.self) {
      const status = await P.PrerequisiteSelfVerificator.verify(this.config);
      this.status = status;

      return status;
    }

    if (this.config.strategy === PrerequisiteStrategyEnum.timezoneUTC) {
      const status = await P.PrerequisiteTimezoneUTCVerificator.verify(
        this.config
      );
      this.status = status;

      return status;
    }

    if (this.config.strategy === PrerequisiteStrategyEnum.path) {
      const status = await P.PrerequisitePathVerificator.verify(this.config);
      this.status = status;

      return status;
    }

    if (this.config.strategy === PrerequisiteStrategyEnum.prisma) {
      const status = await P.PrerequisitePrismaVerificator.verify(this.config);
      this.status = status;

      return status;
    }

    if (this.config.strategy === PrerequisiteStrategyEnum.node) {
      const status = await P.PrerequisiteNodeVerificator.verify(this.config);
      this.status = status;

      return status;
    }

    if (this.config.strategy === PrerequisiteStrategyEnum.RAM) {
      const status = await P.PrerequisiteRAMVerificator.verify(this.config);
      this.status = status;

      return status;
    }

    if (this.config.strategy === PrerequisiteStrategyEnum.space) {
      const status = await P.PrerequisiteSpaceVerificator.verify(this.config);
      this.status = status;

      return status;
    }

    if (this.config.strategy === PrerequisiteStrategyEnum.translations) {
      const status = await P.PrerequisiteTranslationsVerificator.verify(
        this.config
      );
      this.status = status;

      return status;
    }

    if (this.config.strategy === PrerequisiteStrategyEnum.port) {
      const status = await P.PrerequisitePortVerificator.verify(this.config);
      this.status = status;

      return status;
    }

    if (this.config.strategy === PrerequisiteStrategyEnum.migrations) {
      const status = await P.PrerequisiteMigrationsVerificator.verify(
        this.config
      );
      this.status = status;

      return status;
    }

    if (this.config.strategy === PrerequisiteStrategyEnum.jobs) {
      const status = await P.PrerequisiteJobsVerificator.verify(this.config);
      this.status = status;

      return status;
    }

    if (this.config.strategy === PrerequisiteStrategyEnum.memory) {
      const status = await P.PrerequisiteMemoryVerificator.verify(this.config);
      this.status = status;

      return status;
    }

    if (this.config.strategy === PrerequisiteStrategyEnum.outsideConnectivity) {
      const status = await P.PrerequisiteOutsideConnectivityVerificator.verify(
        this.config
      );
      this.status = status;

      return status;
    }

    if (
      this.config.strategy === PrerequisiteStrategyEnum.sslCertificateExpiry
    ) {
      const status = await P.PrerequisiteSSLCertificateExpiryVerificator.verify(
        this.config
      );
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
