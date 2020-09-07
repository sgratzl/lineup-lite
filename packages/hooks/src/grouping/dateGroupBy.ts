import { ColumnInstance, defaultGroupByFn, Row } from 'react-table';

export function dateGroupBy<D extends object>(rows: Row<D>[], column: ColumnInstance<D>): Record<string, Row<D>[]> {
  return defaultGroupByFn(rows, column.id);
}
