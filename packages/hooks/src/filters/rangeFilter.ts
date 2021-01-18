import type { Row } from 'react-table';

export function rangeFilter<D extends object, T>(rows: Row<D>[], ids: string[], filterValue: [T, T]) {
  if (filterValue == null) {
    return rows;
  }
  return rows.filter((row) =>
    ids.some((id) => {
      const v = row.values[id];
      return (filterValue[0] == null || v >= filterValue[0]) && (filterValue[1] == null || v <= filterValue[1]);
    })
  );
}
rangeFilter.autoRemove = (val: [any, any]) => !Array.isArray(val);
