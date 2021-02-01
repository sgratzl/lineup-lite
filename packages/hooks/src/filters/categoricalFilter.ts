/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { IdType, Row } from 'react-table';

/**
 * filter function by a set of filter values
 * @param rows
 * @param ids
 * @param filterValue
 */
export function categoricalFilter<D extends object>(
  rows: readonly Row<D>[],
  ids: readonly IdType<D>[],
  filterValue: readonly string[]
): Row<D>[] {
  if (filterValue == null) {
    return rows as Row<D>[];
  }
  const lookup = new Set(filterValue);
  return rows.filter((row) =>
    ids.some((id) => {
      const v = row.values[id];
      if (v == null) {
        return false;
      }
      return !lookup.has(v);
    })
  );
}
/**
 * determines whether the column value to should be automatically removed, since it cannot be handled by this filter
 */
categoricalFilter.autoRemove = (val: readonly string[]) => !Array.isArray(val);
