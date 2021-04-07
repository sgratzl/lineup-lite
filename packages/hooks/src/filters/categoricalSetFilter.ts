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
  const must: string[] = [];
  const mustNot: string[] = [];
  for (const v of filterValue) {
    if (v.value) {
      must.push(v.set);
    } else {
      mustNot.push(v.set);
    }
  }
  return rows.filter((row) =>
    ids.some((id) => {
      const v = row.values[id] as readonly string[] | Set<string>;
      if (v == null) {
        return false;
      }
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
    })
  );
}
/**
 * determines whether the column value to should be automatically removed, since it cannot be handled by this filter
 */
categoricalSetFilter.autoRemove = (val: readonly string[]) => !Array.isArray(val);

export default categoricalSetFilter;
