import * as Schema from './schema';
import { ETag, WeakETag } from './etag';

import * as Errors from './errors';

export class Revision {
  readonly value: Schema.RevisionType;

  constructor(value: unknown) {
    const result = Schema.Revision.safeParse(value);

    if (!result.success) throw new Errors.InvalidRevisionError();

    this.value = result.data;
  }

  matches(another: Schema.RevisionType): boolean {
    return this.value === another;
  }

  validate(another: Schema.RevisionType): void {
    if (!this.matches(another)) throw new Errors.RevisionMismatchError();
  }

  increment(): Revision {
    return new Revision(this.value + 1);
  }

  static fromETag(etag: ETag | null): Revision {
    if (!etag) {
      throw new Errors.InvalidRevisionError();
    }
    return new Revision(etag.revision);
  }

  static fromWeakETag(weakEtag: WeakETag | null): Revision {
    if (!weakEtag) {
      throw new Errors.InvalidRevisionError();
    }
    return new Revision(weakEtag.revision);
  }
}
