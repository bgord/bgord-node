export type AccessDeniedErrorReasonType =
  | 'hcaptcha'
  | 'csrf'
  | 'general'
  | 'api-key'
  | string;

export type AccessDeniedErrorConfigType = {
  reason: AccessDeniedErrorReasonType;
};

export class AccessDeniedError extends Error {
  reason: AccessDeniedErrorConfigType['reason'];
  constructor(config: AccessDeniedErrorConfigType) {
    super();
    this.reason = config.reason;
  }
}
