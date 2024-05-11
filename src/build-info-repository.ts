import fs from 'node:fs/promises';

import * as Schema from './schema';

export type BuildInfoType = {
  BUILD_DATE: Schema.TimestampType;
  BUILD_VERSION?: Schema.BuildVersionType;
};

export class BuildInfoRepository {
  static async extract(): Promise<BuildInfoType> {
    const BUILD_DATE = Date.now();

    try {
      const packageJsonBuffer = await fs.readFile('package.json');
      const packageJsonString = packageJsonBuffer.toString();
      const packageJson = JSON.parse(packageJsonString);

      const BUILD_VERSION = Schema.BuildVersion.parse(packageJson.version);

      return { BUILD_DATE, BUILD_VERSION };
    } catch (error) {
      return { BUILD_DATE };
    }
  }
}
