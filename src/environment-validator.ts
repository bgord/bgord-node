import * as z from 'zod';
import * as dotenv from 'dotenv';

import { Schema } from './index';

type NodeEnvironmentEnumType = z.infer<typeof Schema.NodeEnvironment>;

type EnvironmentFilename = string;

type AnyZodSchema = z.ZodSchema<any, any>;
type QuietType = boolean;
type QuitType = boolean;

type EnvironmentTypeToFilenameType = Record<
  Schema.NodeEnvironmentEnum,
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
    this.quiet = config?.quit ?? false;
    this.quit = config?.quit ?? true;
    this.environmentTypeToFilename =
      config?.environmentTypeToFilename ?? EnvironmentTypeToFilename;

    const result = Schema.NodeEnvironment.safeParse(config.type);

    if (result.success) {
      this.type = result.data;
    } else {
      if (this.quit) {
        console.log(`Invalid EnvironmentType: ${config.type}`);
        process.exit(1);
      } else {
        throw new NodeEnvironmentError();
      }
    }
  }

  load(): SchemaType {
    const environment = dotenv.config({
      path: this.environmentTypeToFilename[this.type],
    }).parsed;

    return this.schema.parse(environment);
  }
}

class NodeEnvironmentError extends Error {}
