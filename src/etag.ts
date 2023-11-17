import express from 'express';

export type RevisionValueType = number;

export class InvalidRevisionError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, InvalidRevisionError.prototype);
  }
}

export class RevisionMismatchError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, RevisionMismatchError.prototype);
  }
}

export class Revision {
  readonly value: RevisionValueType;

  constructor(value: unknown) {
    if (!Number.isInteger(value) || typeof value !== 'number' || value < 0) {
      throw new InvalidRevisionError();
    }

    this.value = value;
  }

  matches(another: RevisionValueType): boolean {
    return this.value === another;
  }

  validate(another: RevisionValueType): void {
    if (!this.matches(another)) {
      throw new RevisionMismatchError();
    }
  }

  increment(): Revision {
    return new Revision(this.value + 1);
  }

  static fromETag(etag: ETag | null): Revision {
    if (!etag) {
      throw new InvalidRevisionError();
    }
    return new Revision(etag.revision);
  }

  static fromWeakETag(weakEtag: WeakETag | null): Revision {
    if (!weakEtag) {
      throw new InvalidRevisionError();
    }
    return new Revision(weakEtag.revision);
  }
}

export type ETagValueType = string;

export class ETag {
  static HEADER_NAME = 'ETag';

  static IF_MATCH_HEADER_NAME = 'if-match';

  readonly value: ETagValueType;

  private constructor(readonly revision: RevisionValueType) {
    this.value = revision.toString();
  }

  static fromHeader(value?: ETagValueType): ETag | null {
    if (value?.startsWith('W/')) return null;

    return new ETag(Number(value));
  }
}

export type WeakETagValueType = string;

export class WeakETag {
  static HEADER_NAME = 'ETag';

  static IF_MATCH_HEADER_NAME = 'if-match';

  readonly value: WeakETagValueType;

  private constructor(readonly revision: RevisionValueType) {
    this.value = `W/${revision.toString()}`;
  }

  static fromHeader(value: WeakETagValueType): WeakETag {
    if (!value.startsWith('W/')) {
      throw Error('Invalid WeakETag');
    }

    const candidate = Number(value.split('W/')[1]);
    return new WeakETag(candidate);
  }
}

declare global {
  namespace Express {
    export interface Request {
      ETag: ETag | null;
      WeakETag: WeakETag | null;
    }
  }
}

export class ETagExtractor {
  static applyTo(app: express.Application): void {
    app.use(async (request, _response, next) => {
      try {
        const header = String(request.headers[ETag.IF_MATCH_HEADER_NAME]);
        const etag = ETag.fromHeader(header);
        request.ETag = etag;
      } catch (error) {
        request.ETag = null;
      }

      next();
    });
  }
}

export class WeakETagExtractor {
  static applyTo(app: express.Application): void {
    app.use(async (request, _response, next) => {
      try {
        const header = String(request.headers[WeakETag.IF_MATCH_HEADER_NAME]);
        const weakEtag = WeakETag.fromHeader(header);
        request.WeakETag = weakEtag;
      } catch (error) {
        request.WeakETag = null;
      }

      next();
    });
  }
}
