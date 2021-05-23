/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ColumnInstance, Row } from 'react-table';
import type { ICategoricalStats } from '@lineup-lite/components';
import baseGroupBy from './baseGroupBy';
import type { UseStatsColumnProps } from '../hooks';
import type { AnyObject, UnknownObject } from '../interfaces';

export default function categoricalGroupBy<D extends AnyObject = UnknownObject>(
  rows: readonly Row<D>[],
  column: ColumnInstance<D>
): Record<string, Row<D>[]> {
  if (rows.length === 0) {
    return {};
  }
  const base = baseGroupBy(rows, column);
  if ((column as unknown as UseStatsColumnProps).statsValue == null) {
    return base;
  }
  // create a new one but this time sorted
  const stats = (column as unknown as UseStatsColumnProps).statsValue as ICategoricalStats;
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
