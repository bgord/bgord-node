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
};

export class PrerequisiteJobs extends AbstractPrerequisite<
  PrerequisiteJobsConfigType
> {
  readonly strategy = PrerequisiteStrategyEnum.jobs;

  constructor(readonly config: PrerequisiteJobsConfigType) {
    super(config);
  }

  async verify(): Promise<PrerequisiteStatusEnum> {
    return Jobs.areAllRunning(this.config.jobs)
      ? PrerequisiteStatusEnum.success
      : PrerequisiteStatusEnum.failure;
  }
}
