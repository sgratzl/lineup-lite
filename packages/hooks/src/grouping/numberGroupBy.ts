/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ColumnInstance, Row } from 'react-table';
import type { INumberStats } from '@lineup-lite/components';
import type { UseStatsColumnProps } from '../hooks';
import type { AnyObject, UnknownObject } from '../interfaces';
import { histGroupBy, MISSING_GROUP } from './histGroupBy';

export interface NumberGroupByOptions {
  thresholds: number[];
}

export default function numberGroupBy<D extends AnyObject = UnknownObject>(
  rows: readonly Row<D>[],
  column: ColumnInstance<D>,
  options?: NumberGroupByOptions
): Record<string, Row<D>[]> {
  if (!options) {
    return histGroupBy<D, number>(rows, column);
  }
  const stats = (column as unknown as UseStatsColumnProps).statsValue as INumberStats | null;
  let { thresholds } = options;
  if (!thresholds || thresholds.length === 0) {
    // default threshold
    if (stats) {
      thresholds = [(stats.max - stats.min) / 2];
    } else {
      thresholds = [0.5];
    }
  }
  if (thresholds.length === 0) {
    return histGroupBy<D, number>(rows, column);
  }
  const groups: { label: string; rows: Row<D>[]; value: number }[] = thresholds.map((v, i) => {
    if (i === 0) {
      return {
        label: `<= ${stats?.format(v) ?? v.toLocaleString()}`,
        rows: [],
        value: v,
      };
    }
    const prev = thresholds[i - 1];
    return {
      label: `${stats?.format(prev) ?? prev.toLocaleString()} ... ${stats?.format(v) ?? v.toLocaleString()}`,
      rows: [],
      value: v,
    };
  });
  const last = thresholds[thresholds.length - 1];
  const largest = {
    label: `>= ${stats?.format(last) ?? last.toLocaleString()}`,
    rows: [],
    value: last,
  };
  const r: Record<string, Row<D>[]> = {};
  for (const v of groups) {
    r[v.value] = [];
  }
  r[largest.label] = largest.rows;
  r[MISSING_GROUP] = [];

  for (const row of rows) {
    const v = (row.values[column.id] as number) ?? null;
    if (v == null) {
      r[MISSING_GROUP].push(row);
      continue;
    }
    const group = groups.find((g) => v < g.value) ?? largest;
    group.rows.push(row);
  }

  for (const key of Object.keys(r)) {
    if (r[key].length === 0) {
      delete r[key];
    }
  }
  return r;
}

export function numberGroupByFactory<D extends AnyObject = UnknownObject>(
  options: NumberGroupByOptions
): (rows: readonly Row<D>[], column: ColumnInstance<D>, options?: NumberGroupByOptions) => Record<string, Row<D>[]> {
  return (rows, column, o?: NumberGroupByOptions) => numberGroupBy<D>(rows, column, o ?? options);
}
