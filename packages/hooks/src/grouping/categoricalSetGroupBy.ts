/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ColumnInstance, Row } from 'react-table';
import type { ICategoricalStats } from '@lineup-lite/components';
import { baseGroupBy } from './internal';
import { categoricalSortFunc, compareAsc } from '../sort/internal';

export function categoricalSetGroupBy<D extends object = {}>(
  rows: Row<D>[],
  column: ColumnInstance<D>
): Record<string, Row<D>[]> {
  if (rows.length === 0) {
    return {};
  }
  const stats = (column as any).statsValue as ICategoricalStats;
  const sorter = stats ? categoricalSortFunc(stats.categories) : compareAsc;
  return baseGroupBy(rows, column, (d) => (d == null ? null : (Array.from(d) as string[]).sort(sorter).join(',')));
}
