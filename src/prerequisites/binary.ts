import z from 'zod';
import execa from 'execa';

import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
} from '../prerequisites';

const PrerequisiteBinary = z
  .string()
  .min(1)
  .max(64)
  .refine(value => !value.includes(' '));

type PrerequisiteBinaryType = z.infer<typeof PrerequisiteBinary>;

export type PrerequisiteBinaryStrategyConfigType = {
  label: PrerequisiteLabelType;
  strategy: PrerequisiteStrategyEnum.binary;
  binary: PrerequisiteBinaryType;
};

export class PrerequisiteBinaryVerificator {
  static async verify(
    config: PrerequisiteBinaryStrategyConfigType
  ): Promise<PrerequisiteStatusEnum> {
    try {
      const binary = PrerequisiteBinary.parse(config.binary);

      const result = await execa.command(`which ${binary}`);

      return result.exitCode === 0
        ? PrerequisiteStatusEnum.success
        : PrerequisiteStatusEnum.failure;
    } catch (error) {
      return PrerequisiteStatusEnum.failure;
    }
  }
}
