import * as ts from './ts-utils';

type BasePolicyConfig = Record<string, unknown>;

export abstract class Policy<T extends BasePolicyConfig> {
  abstract fails(config: T): Promise<boolean> | boolean;

  abstract error: ts.Constructor<Error>;

  throw() {
    throw new this.error();
  }

  perform(config: T) {
    if (this.fails(config)) {
      this.throw();
    }
  }
}
