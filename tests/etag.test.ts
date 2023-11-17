import { describe, test, expect } from 'vitest';
import {
  ETag,
  WeakETag,
  InvalidRevisionError,
  Revision,
  RevisionMismatchError,
} from '../src/etag';

describe('Revision class', () => {
  test('Revision constructor should create a valid Revision instance', () => {
    const revisionValue = 123;
    const revision = new Revision(revisionValue);

    expect(revision.value).toBe(revisionValue);
  });

  test('Revision constructor should throw InvalidRevisionError for invalid input', () => {
    const invalidValue = 'invalid';

    expect(() => new Revision(invalidValue)).toThrowError(InvalidRevisionError);
  });

  test('Revision matches should correctly compare two Revision instances', () => {
    const revision1 = new Revision(123);
    const revision2 = new Revision(123);
    const revision3 = new Revision(456);

    expect(revision1.matches(revision2.value)).toBe(true);
    expect(revision1.matches(revision3.value)).toBe(false);
  });

  test('Revision validate should throw RevisionMismatchError for mismatched revisions', () => {
    const revision1 = new Revision(123);
    const revision2 = new Revision(456);

    expect(() => revision1.validate(revision2.value)).toThrowError(
      RevisionMismatchError
    );
  });

  test('Revision increment should create a new Revision with incremented value', () => {
    const revision = new Revision(123);
    const incrementedRevision = revision.increment();

    expect(incrementedRevision.value).toBe(revision.value + 1);
  });

  test('Revision fromETag should create a valid Revision instance from ETag', () => {
    const etag = ETag.fromHeader('123');
    const revision = Revision.fromETag(etag);

    // @ts-expect-error
    expect(revision.value).toBe(etag.revision);
  });

  test('Revision fromETag should throw InvalidRevisionError for null ETag', () => {
    const etag = null;

    expect(() => Revision.fromETag(etag)).toThrowError(InvalidRevisionError);
  });

  test('Revision fromWeakETag should create a valid Revision instance from WeakETag', () => {
    const weakEtag = WeakETag.fromHeader('W/123');
    const revision = Revision.fromWeakETag(weakEtag);

    expect(revision.value).toBe(weakEtag.revision);
  });

  test('Revision fromWeakETag should throw InvalidRevisionError for null WeakETag', () => {
    const weakEtag = null;

    expect(() => Revision.fromWeakETag(weakEtag)).toThrowError(
      InvalidRevisionError
    );
  });
});

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
