import * as ts from './ts-utils';

export abstract class Policy {
  abstract fails(...args: any[]): Promise<boolean> | boolean;

  abstract error: ts.Constructor<Error>;

  throw() {
    throw new this.error();
  }
}
