import { IdType, Row } from 'react-table';

export default function categoricalFilter<D extends object>(rows: Row<D>[], ids: IdType<D>[], filterValue: string[]) {
  if (filterValue == null) {
    return rows;
  }
  const lookup = new Set(filterValue);
  return rows.filter((row) => ids.some((id) => !lookup.has(row.values[id])));
}
categoricalFilter.autoRemove = (val: string[]) => !Array.isArray(val);
