import { z } from 'zod';

export enum NodeEnvironmentEnum {
  local = 'local',
  test = 'test',
  staging = 'staging',
  production = 'production',
}

export const NodeEnvironment = z.nativeEnum(NodeEnvironmentEnum);
