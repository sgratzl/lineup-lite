import { ColumnInstance, Row } from 'react-table';

export function numberGroupBy<D extends object>(rows: Row<D>[], column: ColumnInstance<D>): Record<string, Row<D>[]> {
  return {};
}
