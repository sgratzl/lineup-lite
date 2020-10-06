import { ColumnInstance, Row } from 'react-table';
import { histGroupBy } from './histGroupBy';

export function dateGroupBy<D extends object>(rows: Row<D>[], column: ColumnInstance<D>): Record<string, Row<D>[]> {
  return histGroupBy<D, Date>(rows, column);
}
