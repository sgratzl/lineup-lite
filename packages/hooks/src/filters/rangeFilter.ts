/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { Row } from 'react-table';

/**
 * a range numeric filter
 */
export function rangeFilter<D extends object, T>(
  rows: readonly Row<D>[],
  ids: readonly string[],
  filterValue: readonly [T, T]
): Row<D>[] {
  if (filterValue == null) {
    return rows as Row<D>[];
  }
  const matches = (v: T) =>
    (filterValue[0] == null || v >= filterValue[0]) && (filterValue[1] == null || v <= filterValue[1]);
  return rows.filter((row) =>
    ids.some((id) => {
      const v = row.values[id];
      if (v == null) {
        return false;
      }
      if (Array.isArray(v)) {
        return v.every((vi) => v != null && matches(vi));
      }
      return matches(v);
    })
  );
}

rangeFilter.autoRemove = (val: [any, any]) => !Array.isArray(val);
