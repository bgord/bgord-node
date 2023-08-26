import { MultipleJobsType, Jobs } from '../jobs';

import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
} from '../prerequisites';

export type PrerequisiteJobsStrategyConfigType = {
  label: PrerequisiteLabelType;
  strategy: PrerequisiteStrategyEnum.jobs;
  jobs: MultipleJobsType;
};

export class PrerequisiteJobsVerificator {
  static async verify(
    config: PrerequisiteJobsStrategyConfigType
  ): Promise<PrerequisiteStatusEnum> {
    return Jobs.areAllRunning(config.jobs)
      ? PrerequisiteStatusEnum.success
      : PrerequisiteStatusEnum.failure;
  }
}
