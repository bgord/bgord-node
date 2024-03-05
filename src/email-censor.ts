import * as Schema from './schema';

export class EmailCensor {
  static censor(email: Schema.EmailType): Schema.EmailType {
    const [local, domain] = email.split('@');

    if (local.length <= 2) {
      return `${'*'.repeat(local.length)}@${domain}`;
    }

    const censoredLocal = `${local.at(0)}${'*'.repeat(
      local.length - 2
    )}${local.at(-1)}`;

    return `${censoredLocal}@${domain}`;
  }
}
