import { describe, it, expectTypeOf } from 'vitest';
import { Falsy, Nullable } from '../src/ts-utils';

describe('ts-utils', () => {
  describe('Falsy', () => {
    it('should work', () => {
      const a: Falsy<string> = '';
      expectTypeOf(a).toMatchTypeOf<string | null | undefined>();
    });
  });

  describe('Nullable', () => {
    it('should work', () => {
      const a: Nullable<string> = '';
      expectTypeOf(a).toMatchTypeOf<string | null>();
    });
  });
});
