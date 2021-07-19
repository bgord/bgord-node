import { z } from 'zod';
import { v4 as uuid } from 'uuid';

export enum NodeEnvironmentEnum {
  local = 'local',
  test = 'test',
  staging = 'staging',
  production = 'production',
}
export const NodeEnvironment = z.nativeEnum(NodeEnvironmentEnum);

export const Port = z
  .string()
  .refine(value => !isNaN((value as unknown) as number) && value, {
    message: 'invalid_port_type',
  })
  .transform(value => Number(value))
  .refine(value => value > 0, { message: 'too_small_port_number' })
  .refine(value => value < 99999, { message: 'too_big_port_number' });

export const HCaptchaSecretKey = z.string().length(42);

export const HCaptchaSiteKey = z.string().length(36);

export const HCaptchaResponseToken = z.string();

export const UUID = z
  .string()
  .uuid()
  .default(() => uuid());

export const SmtpHost = z.string().nonempty();
export type SmtpHostType = z.infer<typeof SmtpHost>;

export const SmtpPort = Port;
export type SmtpPortType = z.infer<typeof SmtpPort>;

export const SmtpUser = z.string().nonempty();
export type SmtpUserType = z.infer<typeof SmtpUser>;

export const SmtpPass = z.string().nonempty();
export type SmtpPassType = z.infer<typeof SmtpPass>;
