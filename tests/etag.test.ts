import { describe, test, expect } from 'vitest';
import { ETag, RevisionType, WeakETag } from '../src/etag';

describe('ETag', () => {
  test('ETag constructor should create a valid ETag instance', () => {
    const revision: RevisionType = 123;
    const eTag = new ETag(revision);

    expect(eTag.value).toBe(revision.toString());
    expect(eTag.revision).toBe(revision);
  });

  test('ETag fromValue should create a valid ETag instance', () => {
    const value = '123';
    const eTag = ETag.fromValue(value);

    expect(eTag.value).toBe(value);
    expect(eTag.revision).toBe(123); // Assuming the revision value is 123
  });

  test('ETag fromValue should throw an error for WeakETag value', () => {
    const weakETagValue = 'W/123';

    expect(() => ETag.fromValue(weakETagValue)).toThrowError(
      'WeakETag value supplied for a strong ETag constructor'
    );
  });

  test('ETag matches should correctly compare two ETag instances', () => {
    const eTag1 = new ETag(123);
    const eTag2 = new ETag(123);
    const eTag3 = new ETag(456);

    expect(eTag1.matches(eTag2)).toBe(true);
    expect(eTag1.matches(eTag3)).toBe(false);
  });
});

describe('WeakETag class', () => {
  test('WeakETag constructor should create a valid WeakETag instance', () => {
    const revision: RevisionType = 123;
    const weakETag = new WeakETag(revision);

    expect(weakETag.value).toBe(`W/${revision}`);
    expect(weakETag.revision).toBe(revision);
  });

  test('WeakETag fromValue should create a valid WeakETag instance', () => {
    const value = 'W/123';
    const weakETag = WeakETag.fromValue(value);

    expect(weakETag.value).toBe(value);
    expect(weakETag.revision).toBe(123); // Assuming the revision value is 123
  });

  test('WeakETag matches should correctly compare two WeakETag instances', () => {
    const weakETag1 = new WeakETag(123);
    const weakETag2 = new WeakETag(123);
    const weakETag3 = new WeakETag(456);

    expect(weakETag1.matches(weakETag2)).toBe(true);
    expect(weakETag1.matches(weakETag3)).toBe(false);
  });
});
