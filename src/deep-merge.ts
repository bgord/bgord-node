import _ from 'lodash';

export function deepMerge(
  a: Object | undefined,
  b: Object | undefined
): Object {
  return _.mergeWith(
    {},
    a ?? {},
    b ?? {},

    // If `a` is an array, concatenate `b` to it,
    // as _.mergeWith doesn't do it.
    function customizer(a: Object, b: Object): Object | void {
      if (_.isArray(a)) {
        return a.concat(b);
      }
    }
  );
}
