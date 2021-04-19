/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { FilterSetValue } from '../components';
import { ALWAYS_TRUE } from './utils';

/**
 * filter function by a set of filter values
 */
export default function filterByCategoricalSetFilter(
  filterValue?: readonly FilterSetValue<string>[] | null
): (value?: readonly string[] | ReadonlySet<string> | null) => boolean {
  if (filterValue == null) {
    return ALWAYS_TRUE;
  }
  const must: string[] = [];
  const mustNot: string[] = [];
  for (const v of filterValue) {
    if (v.value) {
      must.push(v.set);
    } else {
      mustNot.push(v.set);
    }
  }
  return (v) => {
    const hasV = v instanceof Set ? v : new Set(v);
    if (mustNot.length > 0) {
      // if any must not value is in the values -> false
      for (const mi of mustNot) {
        if (hasV.has(mi)) {
          return false;
        }
      }
    }
    if (must.length > 0) {
      // if any must value is not in the values -> false
      for (const mi of must) {
        if (!hasV.has(mi)) {
          return false;
        }
      }
    }
    return true;
  };
}
