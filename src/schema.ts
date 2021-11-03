import { z } from 'zod';
import { v4 as uuid } from 'uuid';

export const StringToNumber = z
  .string()
  .refine(value => !isNaN((value as unknown) as number) && value, {
    message: 'invalid_number',
  })
  .transform(value => Number(value));

export enum NodeEnvironmentEnum {
  local = 'local',
  test = 'test',
  staging = 'staging',
  production = 'production',
}
export const NodeEnvironment = z.nativeEnum(NodeEnvironmentEnum);

export const Port = StringToNumber.refine(value => value > 0, {
  message: 'too_small_port_number',
}).refine(value => value < 99999, { message: 'too_big_port_number' });

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

export const Email = z
  .string()
  .email()
  .nonempty();
export type EmailType = z.infer<typeof Email>;

export const CookieSecret = z.string().length(32);
export type CookieSecretType = z.infer<typeof CookieSecret>;

export const ContentfulSpaceId = z.string().length(12);
export type ContentfulSpaceIdType = z.infer<typeof ContentfulSpaceId>;

export const ContentfulAccessToken = z.string().length(43);
export type ContentfulAccessTokenType = z.infer<typeof ContentfulAccessToken>;

export const UrlWithoutTrailingSlash = z
  .string()
  .url()
  .nonempty()
  .refine(value => !value.endsWith('/'), {
    message: 'url_cannot_end_with_trailing_slash',
  });
export type UrlWithoutTrailingSlashType = z.infer<
  typeof UrlWithoutTrailingSlash
>;

export const TwitterApiBearerToken = z.string().length(112);
export type TwitterApiBearerTokenType = z.infer<typeof TwitterApiBearerToken>;

export const ApiKey = z.string().length(64);
export type ApiKeyType = z.infer<typeof ApiKey>;

export const SentryDsn = z.string().url();
export type SentryDsnType = z.infer<typeof SentryDsn>;

export const TwitterAppKey = z.string().nonempty();
export type TwitterAppKeyType = z.infer<typeof TwitterAppKey>;

export const TwitterAppSecret = z.string().nonempty();
export type TwitterAppSecretType = z.infer<typeof TwitterAppSecret>;

export const TwitterAccessToken = z.string().nonempty();
export type TwitterAccessTokenType = z.infer<typeof TwitterAccessToken>;

export const TwitterAccessSecret = z.string().nonempty();
export type TwitterAccessSecretType = z.infer<typeof TwitterAccessSecret>;
