import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
  AbstractPrerequisite,
} from '../prerequisites';

export type PrerequisiteOutsideConnectivityConfigType = {
  label: PrerequisiteLabelType;
  enabled?: boolean;
};

export class PrerequisiteOutsideConnectivity extends AbstractPrerequisite<
  PrerequisiteOutsideConnectivityConfigType
> {
  readonly strategy = PrerequisiteStrategyEnum.outsideConnectivity;

  constructor(readonly config: PrerequisiteOutsideConnectivityConfigType) {
    super(config);
  }

  async verify(): Promise<PrerequisiteStatusEnum> {
    if (!this.enabled) return PrerequisiteStatusEnum.undetermined;

    try {
      const result = await fetch('https://google.com');

      return result.ok ? this.pass() : this.reject();
    } catch (error) {
      return this.reject();
    }
  }
}
