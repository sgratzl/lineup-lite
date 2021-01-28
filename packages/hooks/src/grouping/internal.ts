import type { ColumnInstance, Row } from 'react-table';
import { MISSING_GROUP } from './histGroupBy';

export function baseGroupBy<D extends object>(rows: Row<D>[], column: ColumnInstance<D>): Record<string, Row<D>[]> {
  const r: Record<string, Row<D>[]> = {};
  for (const row of rows) {
    const value = row.values[column.id] ?? MISSING_GROUP;
    if (!r[value]) {
      r[value] = [row];
    } else {
      r[value]!.push(row);
    }
  }
  return r;
}
