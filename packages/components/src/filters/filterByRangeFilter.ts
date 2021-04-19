/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { ALWAYS_TRUE } from './utils';

/**
 * a range numeric filter
 */
export default function filterByRangeFilter<T>(filterValue?: readonly [T, T] | null): (v?: T | null) => boolean {
  if (filterValue == null) {
    return ALWAYS_TRUE;
  }
  const matches = (v: T) =>
    (filterValue[0] == null || v >= filterValue[0]) && (filterValue[1] == null || v <= filterValue[1]);
  return (v) => {
    if (v == null) {
      return false;
    }
    if (Array.isArray(v)) {
      return v.every((vi) => v != null && matches(vi));
    }
    return matches(v);
  };
}
