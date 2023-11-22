import { describe, test, expect } from 'vitest';

import { InvalidRevisionError, RevisionMismatchError } from '../src/errors';
import { ETag, WeakETag } from '../src/etag';
import { Revision } from '../src/revision';

describe('Revision class', () => {
  test('Revision constructor should create a valid Revision instance', () => {
    const revisionValue = 0;
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
    const incrementedRevision = revision.next();

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

    expect(revision.value).toBe(weakEtag?.revision);
  });

  test('Revision fromWeakETag should throw InvalidRevisionError for null WeakETag', () => {
    const weakEtag = null;

    expect(() => Revision.fromWeakETag(weakEtag)).toThrowError(
      InvalidRevisionError
    );
  });
});
