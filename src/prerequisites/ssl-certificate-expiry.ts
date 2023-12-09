import sslChecker from 'ssl-checker';

import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
  AbstractPrerequisite,
} from '../prerequisites';

export type PrerequisiteSSLCertificateExpiryConfigType = {
  host: string;
  validDaysMinimum: number;
  label: PrerequisiteLabelType;
  enabled?: boolean;
};

export class PrerequisiteSSLCertificateExpiry extends AbstractPrerequisite<
  PrerequisiteSSLCertificateExpiryConfigType
> {
  readonly strategy = PrerequisiteStrategyEnum.sslCertificateExpiry;

  constructor(readonly config: PrerequisiteSSLCertificateExpiryConfigType) {
    super(config);
  }

  async verify(): Promise<PrerequisiteStatusEnum> {
    if (!this.enabled) return PrerequisiteStatusEnum.undetermined;

    try {
      const result = await sslChecker(this.config.host);

      if (!result.valid) return PrerequisiteStatusEnum.failure;

      return result.daysRemaining <= this.config.validDaysMinimum
        ? PrerequisiteStatusEnum.failure
        : PrerequisiteStatusEnum.success;
    } catch (error) {
      return PrerequisiteStatusEnum.failure;
    }
  }
}
