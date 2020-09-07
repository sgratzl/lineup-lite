import { ColumnInstance, defaultGroupByFn, Row } from 'react-table';

export function categoricalGroupBy<D extends object>(
  rows: Row<D>[],
  column: ColumnInstance<D>
): Record<string, Row<D>[]> {
  return defaultGroupByFn(rows, column.id);
}
