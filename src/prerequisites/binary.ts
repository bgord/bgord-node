import z from 'zod';
import execa from 'execa';

import {
  PrerequisiteLabelType,
  PrerequisiteStatusEnum,
  PrerequisiteStrategyEnum,
  AbstractPrerequisite,
} from '../prerequisites';

const PrerequisiteBinaryValue = z
  .string()
  .min(1)
  .max(64)
  .refine(value => !value.includes(' '));
type PrerequisiteBinaryValueType = z.infer<typeof PrerequisiteBinaryValue>;

type PrerequisiteBinaryConfigType = {
  binary: PrerequisiteBinaryValueType;
  label: PrerequisiteLabelType;
  enabled?: boolean;
};

export class PrerequisiteBinary extends AbstractPrerequisite<
  PrerequisiteBinaryConfigType
> {
  readonly strategy = PrerequisiteStrategyEnum.binary;

  constructor(readonly config: PrerequisiteBinaryConfigType) {
    super(config);
  }

  async verify() {
    if (!this.enabled) return PrerequisiteStatusEnum.undetermined;

    try {
      const binary = PrerequisiteBinaryValue.parse(this.config.binary);

      const result = await execa.command(`which ${binary}`);

      return result.exitCode === 0
        ? PrerequisiteStatusEnum.success
        : PrerequisiteStatusEnum.failure;
    } catch (error) {
      return PrerequisiteStatusEnum.failure;
    }
  }
}
