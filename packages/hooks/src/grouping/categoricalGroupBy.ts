import type { ColumnInstance, Row } from 'react-table';
import type { ICategoricalStats } from '@lineup-lite/components';
import { baseGroupBy } from './internal';

export function categoricalGroupBy<D extends object>(
  rows: Row<D>[],
  column: ColumnInstance<D>
): Record<string, Row<D>[]> {
  if (rows.length === 0) {
    return {};
  }
  const base = baseGroupBy(rows, column);
  if ((column as any).statsValue == null) {
    return base;
  }
  // create a new one but this time sorted
  const stats = (column as any).statsValue as ICategoricalStats;
  const sortedGrouped: Record<string, Row<D>[]> = {};
  stats.categories.forEach((cat) => {
    if (base[cat] != null) {
      sortedGrouped[cat] = base[cat];
      delete base[cat];
    }
  });
  // assign the rest with unknown values
  return Object.assign(sortedGrouped, base);
}
