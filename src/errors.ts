import { MimeRawType } from './mime';
import { TimestampType } from './schema';

export enum AccessDeniedErrorReasonType {
  hcaptcha = 'hcaptcha',
  csrf = 'csrf',
  'api-key' = 'api-key',
  recaptcha = 'recaptcha',
  auth = 'auth',
  'basic-auth' = 'basic-auth',
}

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

export class InvalidMimeError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, InvalidMimeError.prototype);
  }
}

export class NotAcceptedMimeError extends Error {
  mime: MimeRawType;

  constructor(mime: MimeRawType) {
    super();
    Object.setPrototypeOf(this, NotAcceptedMimeError.prototype);
    this.mime = mime;
  }
}

export class TooManyRequestsError extends Error {
  remainingMs: number;

  constructor(remainingMs: number) {
    super();
    this.remainingMs = remainingMs;
    Object.setPrototypeOf(this, TooManyRequestsError.prototype);
  }
}

export type RequestTimerErrorConfigType = {
  timeoutMs: TimestampType;
};

export class RequestTimeoutError extends Error {
  timeoutMs: RequestTimerErrorConfigType['timeoutMs'];

  constructor(config: RequestTimerErrorConfigType) {
    super();
    Object.setPrototypeOf(this, RequestTimeoutError.prototype);
    this.timeoutMs = config.timeoutMs;
  }
}
