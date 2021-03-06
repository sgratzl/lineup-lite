/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { INumericStats } from '@lineup-lite/components';
import { ColumnInstance, defaultGroupByFn, Row } from 'react-table';
import type { UseStatsColumnProps } from '../hooks';
import type { AnyObject, UnknownObject } from '../interfaces';
import { computeArrayNumberStats } from '../stats';

export const MISSING_GROUP = 'Missing Values';
export const OTHERS_GROUPS = 'Other Values';
/**
 * group by histogram
 * @param rows
 * @param column
 */
export function histGroupBy<D extends AnyObject = UnknownObject, T extends number | Date = number>(
  rows: readonly Row<D>[],
  column: ColumnInstance<D>
): Record<string, Row<D>[]> {
  const stats = (column as unknown as UseStatsColumnProps).statsValue as INumericStats<T>;
  if (stats == null) {
    return defaultGroupByFn(rows as Row<D>[], column.id);
  }
  // group by bin
  const r: Record<string, Row<D>[]> = {};
  stats.hist.forEach((bin, i) => {
    const key = bin.label;
    const group = rows.filter((row) => {
      let v = row.values[column.id];
      if (v == null) {
        return false;
      }
      // support group by variants
      if (Array.isArray(v)) {
        // TODO support dates, too
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-explicit-any
        const arrayStats = computeArrayNumberStats(v, column as unknown as any)!;
        v = arrayStats.median;
      }
      return (
        v != null &&
        ((bin.x0 <= v && v < bin.x1) || (v < bin.x1 && i === 0) || (i === stats.hist.length - 1 && v >= bin.x0))
      );
    });
    if (group.length > 0) {
      r[key] = group;
    }
  });
  const group = rows.filter((row) => row.values[column.id] == null);
  if (group.length > 0) {
    r[MISSING_GROUP] = group;
  }
  return r;
}
