import * as z from 'zod';
import * as dotenv from 'dotenv';

import { NodeEnvironment, NodeEnvironmentEnum } from './schema';

type NodeEnvironmentEnumType = z.infer<typeof NodeEnvironment>;

type EnvironmentFilename = string;

type AnyZodSchema = z.ZodSchema<any, any>;
type QuietType = boolean;
type QuitType = boolean;

type EnvironmentTypeToFilenameType = Record<
  NodeEnvironmentEnum,
  EnvironmentFilename
>;

const EnvironmentTypeToFilename: EnvironmentTypeToFilenameType = {
  local: '.env.local',
  staging: '.env.staging',
  test: '.env.test',
  production: '.env.production',
};

type EnvironmentValidatorConfig = {
  type: unknown;
  schema: AnyZodSchema;
  quiet?: QuietType;
  quit?: QuitType;
  environmentTypeToFilename?: EnvironmentTypeToFilenameType;
};

export class EnvironmentValidator<SchemaType> {
  type: NodeEnvironmentEnumType;
  schema: z.Schema<SchemaType>;
  quiet: QuietType;
  quit: QuitType;
  environmentTypeToFilename: EnvironmentTypeToFilenameType;

  constructor(config: EnvironmentValidatorConfig) {
    this.schema = config.schema;
    this.quiet = config?.quiet ?? false;
    this.quit = config?.quit ?? true;
    this.environmentTypeToFilename =
      config?.environmentTypeToFilename ?? EnvironmentTypeToFilename;

    const result = NodeEnvironment.safeParse(config.type);

    if (result.success) {
      this.type = result.data;
    } else if (this.quit) {
      // biome-ignore lint: lint/suspicious/noConsoleLog
      console.log(`Invalid EnvironmentType: ${config.type}`);
      process.exit(1);
    } else {
      throw new NodeEnvironmentError();
    }
  }

  load(): SchemaType & { type: NodeEnvironmentEnumType } {
    const path = this.environmentTypeToFilename[this.type];

    const environment = dotenv.config({ path }).parsed;

    if (!environment) {
      // biome-ignore lint: lint/suspicious/noConsoleLog
      console.log(`Missing or empty environment file: ${path}`);
      process.exit(1);
    }

    return { ...this.schema.parse(environment), type: this.type };
  }
}

class NodeEnvironmentError extends Error {}
