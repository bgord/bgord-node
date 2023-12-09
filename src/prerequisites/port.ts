import net from 'net';

import * as Schema from '../schema';
import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
  AbstractPrerequisite,
} from '../prerequisites';

export type PrerequisitePortConfigType = {
  port: Schema.PortType;
  label: PrerequisiteLabelType;
};

export class PrerequisitePort extends AbstractPrerequisite<
  PrerequisitePortConfigType
> {
  readonly strategy = PrerequisiteStrategyEnum.port;

  constructor(readonly config: PrerequisitePortConfigType) {
    super(config);
  }

  async verify(): Promise<PrerequisiteStatusEnum> {
    return new Promise(resolve => {
      const server = net.createServer();

      server.listen(this.config.port, () =>
        server.close(() => resolve(PrerequisiteStatusEnum.success))
      );

      server.on('error', () => resolve(PrerequisiteStatusEnum.failure));
    });
  }
}
