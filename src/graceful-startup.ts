import * as Schema from './schema';
import net from 'net';

type GracefulStartupOptionsType = {
  port: Schema.PortType;
  callback: Function;
};
type GracefulStartupResultType = boolean;

export class GracefulStartup {
  static async check(
    options: GracefulStartupOptionsType
  ): Promise<GracefulStartupResultType> {
    return new Promise(resolve => {
      const server = net.createServer();

      server.listen(options.port, () => server.close(() => resolve(true)));
      server.on('error', async () => {
        await options.callback();
        resolve(false);
      });
    });
  }
}
