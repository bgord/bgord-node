import mergeWith from 'lodash/mergeWith';
import isArray from 'lodash/isArray';

type NonArrayObject = { [key: string]: any } & { length?: never };

export function deepMerge(
  a: NonArrayObject | undefined,
  b: NonArrayObject | undefined
): Object {
  return mergeWith(
    {},
    a ?? {},
    b ?? {},

    // If `a` is an array, concatenate `b` to it,
    // as _.mergeWith doesn't do it.
    function customizer(a: Object, b: Object): Object | void {
      if (isArray(a)) {
        return a.concat(b);
      }
    }
  );
}
