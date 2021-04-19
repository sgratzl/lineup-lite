/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { Row } from 'react-table';
import { filterByRangeFilter, ALWAYS_TRUE } from '@lineup-lite/components';
import type { AnyObject, UnknownObject } from '../interfaces';

/**
 * a range numeric filter
 */
export function rangeFilter<D extends AnyObject = UnknownObject, T = unknown>(
  rows: readonly Row<D>[],
  ids: readonly string[],
  filterValue: readonly [T, T]
): Row<D>[] {
  const f = filterByRangeFilter(filterValue);
  if (f === ALWAYS_TRUE) {
    return rows as Row<D>[];
  }
  return rows.filter((row) =>
    ids.some((id) => {
      const v = row.values[id];
      return f(v);
    })
  );
}

rangeFilter.autoRemove = (val: [unknown, unknown]) => !Array.isArray(val);

export default rangeFilter;
