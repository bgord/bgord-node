import { z } from 'zod';
import { v4 as uuid } from 'uuid';

export const StringToNumber = z
  .string()
  .trim()
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

export const HCaptchaSecretKey = z
  .string()
  .trim()
  .length(42);

export const HCaptchaSiteKey = z
  .string()
  .trim()
  .length(36);

export const HCaptchaResponseToken = z.string().trim();

export const UUID = z
  .string()
  .uuid()
  .default(() => uuid());
export type UUIDType = z.infer<typeof UUID>;

export const SmtpHost = z
  .string()
  .trim()
  .min(1);
export type SmtpHostType = z.infer<typeof SmtpHost>;

export const SmtpPort = Port;
export type SmtpPortType = z.infer<typeof SmtpPort>;

export const SmtpUser = z
  .string()
  .trim()
  .min(1);
export type SmtpUserType = z.infer<typeof SmtpUser>;

export const SmtpPass = z
  .string()
  .trim()
  .min(1);
export type SmtpPassType = z.infer<typeof SmtpPass>;

export const Email = z
  .string()
  .trim()
  .email()
  .min(1);
export type EmailType = z.infer<typeof Email>;

export const CookieSecret = z
  .string()
  .trim()
  .length(32);
export type CookieSecretType = z.infer<typeof CookieSecret>;

export const ContentfulSpaceId = z
  .string()
  .trim()
  .length(12);
export type ContentfulSpaceIdType = z.infer<typeof ContentfulSpaceId>;

export const ContentfulAccessToken = z
  .string()
  .trim()
  .length(43);
export type ContentfulAccessTokenType = z.infer<typeof ContentfulAccessToken>;

export const UrlWithoutTrailingSlash = z
  .string()
  .trim()
  .url()
  .min(1)
  .refine(value => !value.endsWith('/'), {
    message: 'url_cannot_end_with_trailing_slash',
  });
export type UrlWithoutTrailingSlashType = z.infer<
  typeof UrlWithoutTrailingSlash
>;

export const TwitterApiBearerToken = z
  .string()
  .trim()
  .length(112);
export type TwitterApiBearerTokenType = z.infer<typeof TwitterApiBearerToken>;

export const ApiKey = z
  .string()
  .trim()
  .length(64);
export type ApiKeyType = z.infer<typeof ApiKey>;

export const TwitterAppKey = z
  .string()
  .trim()
  .min(1);
export type TwitterAppKeyType = z.infer<typeof TwitterAppKey>;

export const TwitterAppSecret = z
  .string()
  .trim()
  .min(1);
export type TwitterAppSecretType = z.infer<typeof TwitterAppSecret>;

export const TwitterAccessToken = z
  .string()
  .trim()
  .min(1);
export type TwitterAccessTokenType = z.infer<typeof TwitterAccessToken>;

export const TwitterAccessSecret = z
  .string()
  .trim()
  .min(1);
export type TwitterAccessSecretType = z.infer<typeof TwitterAccessSecret>;

export const RecaptchaSiteKey = z
  .string()
  .trim()
  .length(40);
export type RecaptchaSiteKeyType = z.infer<typeof RecaptchaSiteKey>;

export const RecaptchaSecretKey = z
  .string()
  .trim()
  .length(40);
export type RecaptchaSecretKeyType = z.infer<typeof RecaptchaSecretKey>;

export const FeatureFlag = z.literal('yes').or(z.literal('no'));
export type FeatureFlagType = z.infer<typeof FeatureFlag>;

export const Localhost = z.literal('127.0.0.1');
export type LocalhostType = z.infer<typeof Localhost>;

export const MailerliteApiKey = z
  .string()
  .trim()
  .length(32);
export type MailerliteApiKeyType = z.infer<typeof MailerliteApiKey>;

export const MailerliteGroupId = z
  .string()
  .refine(value => !isNaN((value as unknown) as number) && value, {
    message: 'invalid_mailerlite_group_id',
  })
  .transform(value => Number(value))
  .refine(value => value > 0, { message: 'invalid_mailerlite_group_id' });
export type MailerliteGroupIdType = z.infer<typeof MailerliteGroupId>;

export const AdminUsername = z
  .string()
  .trim()
  .min(5)
  .max(20);
export type AdminUsernameType = z.infer<typeof AdminUsername>;

export const AdminPassword = z
  .string()
  .trim()
  .min(5)
  .max(48);
export type AdminPasswordType = z.infer<typeof AdminPassword>;

export const Timestamp = z
  .number()
  .positive()
  .default(() => Date.now());
export type TimestampType = z.infer<typeof Timestamp>;

export const FileSizeInBytes = z
  .number()
  .int()
  .positive();
export type FileSizeInBytesType = z.infer<typeof FileSizeInBytes>;

export const UploadedFile = z.object({
  fieldName: z.string().min(1),
  originalFilename: z.string().min(1),
  path: z.string().min(1),
  headers: z.record(z.string()),
  size: FileSizeInBytes,
});
export type UploadedFileType = z.infer<typeof UploadedFile>;

export const TimeZoneOffset = z
  .string()
  .trim()
  .or(z.undefined())
  .transform(value => Number(value))
  .transform(value => (isNaN(value) ? 0 : value));
export type TimeZoneOffsetType = z.infer<typeof TimeZoneOffset>;

export const Language = z
  .string()
  .trim()
  .default('en');
export type LanguageType = z.infer<typeof Language>;
