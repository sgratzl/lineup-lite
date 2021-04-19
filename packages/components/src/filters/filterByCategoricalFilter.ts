/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { ALWAYS_TRUE } from './utils';

/**
 * filter function by a set of filter values
 */
export default function filterByCategoricalFilter(
  filterValue?: readonly string[] | null
): (value?: string | null) => boolean {
  if (filterValue == null) {
    return ALWAYS_TRUE;
  }
  const lookup = new Set(filterValue);
  return (v) => {
    if (v == null) {
      return false;
    }
    return !lookup.has(v);
  };
}
