/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { IdType, Row } from 'react-table';
import { filterByCategoricalFilter, ALWAYS_TRUE } from '@lineup-lite/components';
import type { AnyObject, UnknownObject } from '../interfaces';

/**
 * filter function by a set of filter values
 * @param rows
 * @param ids
 * @param filterValue
 */
export function categoricalFilter<D extends AnyObject = UnknownObject>(
  rows: readonly Row<D>[],
  ids: readonly IdType<D>[],
  filterValue: readonly string[]
): Row<D>[] {
  const f = filterByCategoricalFilter(filterValue);
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
/**
 * determines whether the column value to should be automatically removed, since it cannot be handled by this filter
 */
categoricalFilter.autoRemove = (val: readonly string[]) => !Array.isArray(val);

export default categoricalFilter;
