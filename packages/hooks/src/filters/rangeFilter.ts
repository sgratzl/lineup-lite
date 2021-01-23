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
  return rows.filter((row) =>
    ids.some((id) => {
      const v = row.values[id];
      return (filterValue[0] == null || v >= filterValue[0]) && (filterValue[1] == null || v <= filterValue[1]);
    })
  );
}

rangeFilter.autoRemove = (val: [any, any]) => !Array.isArray(val);
