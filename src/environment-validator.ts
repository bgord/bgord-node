import { z } from "zod/v4";

import { NodeEnvironment } from "./schema";

type NodeEnvironmentEnumType = z.infer<typeof NodeEnvironment>;

type AnyZodSchema = z.ZodSchema<any, any>;
type QuietType = boolean;
type QuitType = boolean;

type EnvironmentValidatorConfig = {
  type: unknown;
  schema: AnyZodSchema;
  quiet?: QuietType;
  quit?: QuitType;
};

export class EnvironmentValidator<SchemaType> {
  type: NodeEnvironmentEnumType;
  schema: z.Schema<SchemaType>;
  quiet: QuietType;
  quit: QuitType;

  constructor(config: EnvironmentValidatorConfig) {
    this.schema = config.schema;
    this.quiet = config?.quiet ?? false;
    this.quit = config?.quit ?? true;

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
    return { ...this.schema.parse(process.env), type: this.type };
  }
}

class NodeEnvironmentError extends Error {}
