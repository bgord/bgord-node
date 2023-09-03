import sslChecker from 'ssl-checker';

import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
} from '../prerequisites';

export type PrerequisiteSSLCertificateExpiryStrategyConfigType = {
  label: PrerequisiteLabelType;
  strategy: PrerequisiteStrategyEnum.sslCertificateExpiry;
  host: string;
  validDaysMinimum: number;
};

export class PrerequisiteSSLCertificateExpiryVerificator {
  static async verify(
    config: PrerequisiteSSLCertificateExpiryStrategyConfigType
  ): Promise<PrerequisiteStatusEnum> {
    try {
      const result = await sslChecker(config.host);

      if (!result.valid) return PrerequisiteStatusEnum.failure;

      return result.daysRemaining <= config.validDaysMinimum
        ? PrerequisiteStatusEnum.failure
        : PrerequisiteStatusEnum.success;
    } catch (error) {
      return PrerequisiteStatusEnum.failure;
    }
  }
}
