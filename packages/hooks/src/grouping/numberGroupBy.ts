import { ColumnInstance, defaultGroupByFn, Row } from 'react-table';

export function numberGroupBy<D extends object>(rows: Row<D>[], column: ColumnInstance<D>): Record<string, Row<D>[]> {
  // TODO
  return defaultGroupByFn(rows, column.id);
}
