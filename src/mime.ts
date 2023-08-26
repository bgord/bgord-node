import { InvalidMimeError } from './errors';

export type MimeRawType = string;
export type MimeTypeType = string;
export type MimeSubtypeType = string;

export class Mime {
  raw: MimeRawType;
  type: MimeTypeType;
  subtype: MimeSubtypeType;

  constructor(value: MimeRawType) {
    const [type, subtype] = value.split('/');

    if (typeof type !== 'string' || type.length === 0) {
      throw new InvalidMimeError();
    }

    if (typeof subtype !== 'string' || subtype.length === 0) {
      throw new InvalidMimeError();
    }

    this.raw = value;
    this.type = type;
    this.subtype = subtype;
  }

  isSatisfiedBy(another: Mime): boolean {
    if (this.raw === another.raw) return true;

    const typeMatches = this.type === another.type || this.type === '*';
    if (!typeMatches) return false;

    return this.subtype === another.subtype || this.subtype === '*';
  }
}
