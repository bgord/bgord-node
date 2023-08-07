import net from 'net';

import * as Schema from '../schema';
import {
  PrerequisiteLabelType,
  PrerequisiteStrategyEnum,
  PrerequisiteStatusEnum,
} from '../prerequisites';

export type PrerequisitePortStrategyConfigType = {
  label: PrerequisiteLabelType;
  strategy: PrerequisiteStrategyEnum.port;
  port: Schema.PortType;
};

export class PrerequisitePortVerificator {
  static async verify(
    config: PrerequisitePortStrategyConfigType
  ): Promise<PrerequisiteStatusEnum> {
    return new Promise(resolve => {
      const server = net.createServer();

      server.listen(config.port, () =>
        server.close(() => resolve(PrerequisiteStatusEnum.success))
      );

      server.on('error', () => resolve(PrerequisiteStatusEnum.failure));
    });
  }
}
