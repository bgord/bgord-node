import * as ts from './ts-utils';

type BasePolicyConfig = Record<string, unknown>;

export abstract class Policy<T extends BasePolicyConfig> {
  abstract fails(config: T): Promise<boolean> | boolean;

  abstract error: ts.Constructor<Error>;

  abstract message: string;

  throw() {
    throw new this.error();
  }

  async perform(config: T) {
    if (await this.fails(config)) {
      this.throw();
    }
  }

  async passes(config: T) {
    return !(await this.fails(config));
  }
}
