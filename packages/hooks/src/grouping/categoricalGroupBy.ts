import type { ColumnInstance, Row } from 'react-table';
import { MISSING_GROUP } from './histGroupBy';
import type { ICategoricalStats } from '@lineup-lite/components';

export function categoricalGroupBy<D extends object>(
  rows: Row<D>[],
  column: ColumnInstance<D>
): Record<string, Row<D>[]> {
  if (rows.length === 0) {
    return {};
  }
  const r: Record<string, Row<D>[]> = {};
  for (const row of rows) {
    const value = row.values[column.id] ?? MISSING_GROUP;
    if (!r[value]) {
      r[value] = [row];
    } else {
      r[value]!.push(row);
    }
  }
  if ((column as any).statsValue == null) {
    return r;
  }

  // create a new one but this time sorted
  const stats = (column as any).statsValue as ICategoricalStats;
  const sortedGrouped: Record<string, Row<D>[]> = {};
  stats.categories.forEach((cat) => {
    if (r[cat] != null) {
      sortedGrouped[cat] = r[cat];
      delete r[cat];
    }
  });
  // assign the rest with unknown values
  return Object.assign(sortedGrouped, r);
}
