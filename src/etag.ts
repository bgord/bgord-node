import * as z from 'zod';

export const Revision = z.coerce
  .number()
  .int()
  .positive();
export type RevisionType = z.infer<typeof Revision>;

export type ETagValueType = string;

export class ETag {
  readonly value: ETagValueType;

  constructor(readonly revision: RevisionType) {
    this.value = revision.toString();
  }

  matches(another: ETag): boolean {
    return this.value === another.value && this.revision === another.revision;
  }

  static fromValue(value: ETagValueType): ETag {
    if (value.startsWith('W/')) {
      throw Error('WeakETag value supplied for a strong ETag constructor');
    }
    const revision = Revision.parse(value);

    return new ETag(revision);
  }
}

export type WeakETagValueType = string;

export class WeakETag {
  readonly value: WeakETagValueType;

  constructor(readonly revision: RevisionType) {
    this.value = `W/${revision.toString()}`;
  }

  matches(another: WeakETag): boolean {
    return this.value === another.value && this.revision === another.revision;
  }

  static fromValue(value: WeakETagValueType): WeakETag {
    if (!value.startsWith('W/')) {
      throw Error('Strong ETag value supplied for a Weak ETag constructor');
    }

    const candidate = value.split('W/')[1];
    const revision = Revision.parse(candidate);

    return new WeakETag(revision);
  }
}
