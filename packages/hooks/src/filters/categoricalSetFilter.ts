import type { IdType, Row } from 'react-table';
import type { FilterSetValue } from '@lineup-lite/components';

/**
 * filter function by a set of filter values
 * @param rows
 * @param ids
 * @param filterValue
 */
export function categoricalSetFilter<D extends object>(
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
      for (const vi of v) {
        if (!must.has(vi) || mustNot.has(vi)) {
          return false;
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
