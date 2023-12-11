import { MultipleJobsType, Jobs } from '../jobs';

import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
  AbstractPrerequisite,
} from '../prerequisites';

export type PrerequisiteJobsConfigType = {
  jobs: MultipleJobsType;
  label: PrerequisiteLabelType;
  enabled?: boolean;
};

export class PrerequisiteJobs extends AbstractPrerequisite<
  PrerequisiteJobsConfigType
> {
  readonly strategy = PrerequisiteStrategyEnum.jobs;

  constructor(readonly config: PrerequisiteJobsConfigType) {
    super(config);
  }

  async verify(): Promise<PrerequisiteStatusEnum> {
    if (!this.enabled) return PrerequisiteStatusEnum.undetermined;

    return Jobs.areAllRunning(this.config.jobs) ? this.pass() : this.reject();
  }
}
