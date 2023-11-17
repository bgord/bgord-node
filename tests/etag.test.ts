import { describe, test, expect } from 'vitest';
import { ETag, WeakETag } from '../src/etag';

describe('ETag class', () => {
  test('ETag fromHeader should create a valid ETag instance', () => {
    const value = '123';
    const etag = ETag.fromHeader(value);

    //@ts-expect-error
    expect(etag.value).toBe(value);
    //@ts-expect-error
    expect(etag.revision).toBe(123);
  });

  test('ETag fromHeader should return null for WeakETag value', () => {
    const weakETagValue = 'W/123';
    const etag = ETag.fromHeader(weakETagValue);

    expect(etag).toBe(null);
  });
});

describe('WeakETag class', () => {
  test('WeakETag fromHeader should create a valid WeakETag instance', () => {
    const value = 'W/123';
    const weakEtag = WeakETag.fromHeader(value);

    expect(weakEtag.value).toBe(value);
    expect(weakEtag.revision).toBe(123);
  });

  test('WeakETag fromHeader should throw an error for invalid WeakETag value', () => {
    const invalidValue = 'invalid';

    expect(() => WeakETag.fromHeader(invalidValue)).toThrowError(
      'Invalid WeakETag'
    );
  });
});
