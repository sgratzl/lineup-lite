/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { IdType, Row } from 'react-table';
import type { FilterSetValue } from '@lineup-lite/components';
import type { AnyObject, UnknownObject } from '../interfaces';

/**
 * filter function by a set of filter values
 * @param rows
 * @param ids
 * @param filterValue
 */
export function categoricalSetFilter<D extends AnyObject = UnknownObject>(
  rows: readonly Row<D>[],
  ids: readonly IdType<D>[],
  filterValue: readonly FilterSetValue<string>[]
): Row<D>[] {
  if (filterValue == null) {
    return rows as Row<D>[];
  }
  const must = new Set<string>();
  const mustNot = new Set<string>();
  for (const v of filterValue) {
    if (v.value) {
      must.add(v.set);
    } else {
      mustNot.add(v.set);
    }
  }
  return rows.filter((row) =>
    ids.some((id) => {
      const v = row.values[id] as readonly string[] | Set<string>;
      if (v == null) {
        return false;
      }
      if (mustNot.size > 0) {
        for (const vi of v) {
          if (mustNot.has(vi)) {
            return false;
          }
        }
      }
      if (must.size > 0) {
        for (const vi of v) {
          if (!must.has(vi)) {
            return false;
          }
        }
      }
      return true;
    })
  );
}
/**
 * determines whether the column value to should be automatically removed, since it cannot be handled by this filter
 */
categoricalSetFilter.autoRemove = (val: readonly string[]) => !Array.isArray(val);

export default categoricalSetFilter;
