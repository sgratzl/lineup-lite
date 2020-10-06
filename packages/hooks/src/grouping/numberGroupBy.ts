import { ColumnInstance, Row } from 'react-table';
import { histGroupBy } from './histGroupBy';

export function numberGroupBy<D extends object>(rows: Row<D>[], column: ColumnInstance<D>): Record<string, Row<D>[]> {
  return histGroupBy<D, number>(rows, column);
}
