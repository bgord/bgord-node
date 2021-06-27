import { ZodSchema } from 'zod';

type EnvironmentFilename = string;

type EnvironmentType = 'local' | 'staging' | 'production' | 'test';
type AnyZodSchema = ZodSchema<any, any>;
type QuietType = boolean;
type QuitType = boolean;

type EnvironmentTypeToFilenameType = Record<
  EnvironmentType,
  EnvironmentFilename
>;

const EnvironmentTypeToFilename: EnvironmentTypeToFilenameType = {
  local: '.env.local',
  staging: '.env.staging',
  test: '.env.test',
  production: '.env.production',
};

type EnvironmentValidatorConfig = {
  type: EnvironmentType;
  schema: AnyZodSchema;
  quiet?: QuietType;
  quit?: QuitType;
  environmentTypeToFilename?: EnvironmentTypeToFilenameType;
};

export class EnvironmentValidator {
  type: EnvironmentValidatorConfig['type'];
  schema: EnvironmentValidatorConfig['schema'];
  quiet: QuietType;
  quit: QuitType;
  environmentTypeToFilename: EnvironmentTypeToFilenameType;

  constructor(config: EnvironmentValidatorConfig) {
    this.type = config.type;
    this.schema = config.schema;
    this.quiet = config?.quit ?? false;
    this.quit = config?.quit ?? true;
    this.environmentTypeToFilename =
      config?.environmentTypeToFilename ?? EnvironmentTypeToFilename;
  }
}
