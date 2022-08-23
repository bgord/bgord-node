export type AccessDeniedErrorReasonType =
  | 'hcaptcha'
  | 'csrf'
  | 'general'
  | 'api-key'
  | 'recaptcha'
  | 'auth'
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

export class InvalidCredentialsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
  }
}

export class FileNotFoundError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, FileNotFoundError.prototype);
  }
}
