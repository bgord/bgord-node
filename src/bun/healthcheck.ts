import { createFactory } from "hono/factory";

import * as Schema from "../schema";
import {
  AbstractPrerequisite,
  BasePrerequisiteConfig,
  PrerequisiteStatusEnum,
  PrerequisiteLabelType,
} from "../prerequisites";
import { BuildInfoRepository } from "../build-info-repository";
import { Stopwatch, StopwatchResultType } from "../stopwatch";
import { Uptime, UptimeResultType } from "../uptime";
import { MemoryConsumption } from "../memory-consumption";
import { Size, SizeUnit } from "../size";

const handler = createFactory();

type HealthcheckResultType = {
  ok: PrerequisiteStatusEnum;
  version: Schema.BuildVersionType;
  details: {
    label: PrerequisiteLabelType;
    status: PrerequisiteStatusEnum;
  }[];
  uptime: UptimeResultType;
  memory: {
    bytes: Size["bytes"];
    formatted: ReturnType<Size["format"]>;
  };
} & StopwatchResultType;

export class Healthcheck {
  static build = (
    prerequisites: AbstractPrerequisite<BasePrerequisiteConfig>[]
  ) =>
    handler.createHandlers(async (c) => {
      const stopwatch = new Stopwatch();

      const build = await BuildInfoRepository.extract();

      const details: HealthcheckResultType["details"][number][] = [];

      for (const prerequisite of prerequisites) {
        const status = await prerequisite.verify();
        details.push({ label: prerequisite.label, status });
      }

      const ok = details.every(
        (result) => result.status !== PrerequisiteStatusEnum.failure
      )
        ? PrerequisiteStatusEnum.success
        : PrerequisiteStatusEnum.failure;

      const code = ok === PrerequisiteStatusEnum.success ? 200 : 424;

      const result: HealthcheckResultType = {
        ok,
        details,
        version: build.BUILD_VERSION ?? Schema.BuildVersion.parse("unknown"),
        uptime: Uptime.get(),
        memory: {
          bytes: MemoryConsumption.get().toBytes(),
          formatted: MemoryConsumption.get().format(SizeUnit.MB),
        },
        ...stopwatch.stop(),
      };

      return c.json(result, code);
    });
}
