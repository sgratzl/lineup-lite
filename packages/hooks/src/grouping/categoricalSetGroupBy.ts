/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ColumnInstance, Row } from 'react-table';
import type { ICategoricalStats } from '@lineup-lite/components';
import baseGroupBy from './baseGroupBy';
import { categoricalSortFunc, compareAsc } from '../sort/internal';
import type { UseStatsColumnProps } from '../hooks';
import type { AnyObject, UnknownObject } from '../interfaces';

export default function categoricalSetGroupBy<D extends AnyObject = UnknownObject>(
  rows: readonly Row<D>[],
  column: ColumnInstance<D>
): Record<string, Row<D>[]> {
  if (rows.length === 0) {
    return {};
  }
  const stats = (column as unknown as UseStatsColumnProps).statsValue as ICategoricalStats;
  const sorter = stats ? categoricalSortFunc(stats.categories) : compareAsc;
  // sort by join groups
  return baseGroupBy(rows, column, (d) => (d == null ? null : [...(d as string[])].sort(sorter).join(',')));
}
