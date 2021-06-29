import { z } from 'zod';

export enum NodeEnvironmentEnum {
  local = 'local',
  test = 'test',
  staging = 'staging',
  production = 'production',
}
export const NodeEnvironment = z.nativeEnum(NodeEnvironmentEnum);

// @ts-ignore
export const Port = z
  .string()
  .refine(value => !isNaN((value as unknown) as number) && value, {
    message: 'invalid_port_type',
  })
  .transform(value => Number(value))
  .refine(value => value > 0, { message: 'too_small_port_number' })
  .refine(value => value < 99999, { message: 'too_big_port_number' });
