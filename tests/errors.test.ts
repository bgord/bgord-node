import { describe, test, expect } from 'vitest';
import {
  AccessDeniedError,
  InvalidCredentialsError,
  FileNotFoundError,
  InvalidMimeError,
  NotAcceptedMimeError,
  TooManyRequestsError,
  RequestTimeoutError,
  InvalidRevisionError,
  RevisionMismatchError,
  AccessDeniedErrorReasonType,
} from '../src/errors';

describe('Error classes', () => {
  test('creates AccessDeniedError with correct reason', () => {
    const accessDeniedError = new AccessDeniedError({
      reason: AccessDeniedErrorReasonType.hcaptcha,
    });
    expect(accessDeniedError.reason).toBe('hcaptcha');
  });

  test('creates InvalidCredentialsError', () => {
    const invalidCredentialsError = new InvalidCredentialsError();
    expect(invalidCredentialsError instanceof Error).toBe(true);
  });

  test('creates FileNotFoundError', () => {
    const fileNotFoundError = new FileNotFoundError();
    expect(fileNotFoundError instanceof Error).toBe(true);
  });

  test('creates InvalidMimeError', () => {
    const invalidMimeError = new InvalidMimeError();
    expect(invalidMimeError instanceof Error).toBe(true);
  });

  test('creates NotAcceptedMimeError with correct mime', () => {
    const notAcceptedMimeError = new NotAcceptedMimeError('application/json');
    expect(notAcceptedMimeError.mime).toBe('application/json');
  });

  test('creates TooManyRequestsError with correct remainingMs', () => {
    const tooManyRequestsError = new TooManyRequestsError(5000);
    expect(tooManyRequestsError.remainingMs).toBe(5000);
  });

  test('creates RequestTimeoutError with correct ms', () => {
    const requestTimeoutError = new RequestTimeoutError({ ms: 10000 });
    expect(requestTimeoutError.ms).toBe(10000);
  });

  test('creates InvalidRevisionError', () => {
    const invalidRevisionError = new InvalidRevisionError();
    expect(invalidRevisionError instanceof Error).toBe(true);
  });

  test('creates RevisionMismatchError', () => {
    const revisionMismatchError = new RevisionMismatchError();
    expect(revisionMismatchError instanceof Error).toBe(true);
  });
});
