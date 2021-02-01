/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ColumnInstance, Row } from 'react-table';
import { identity } from '../renderers/utils';
import { compareAsc } from '../sort/internal';
import { MISSING_GROUP } from './histGroupBy';

export function baseGroupBy<D extends object>(
  rows: Row<D>[],
  column: ColumnInstance<D>,
  acc: (v: any) => string | null = identity
): Record<string, Row<D>[]> {
  const r: Record<string, Row<D>[]> = {};
  for (const row of rows) {
    const value = acc(row.values[column.id]) ?? MISSING_GROUP;
    if (!r[value]) {
      r[value] = [row];
    } else {
      r[value]!.push(row);
    }
  }
  // sort by key asc
  const sorted: Record<string, Row<D>[]> = {};
  for (const key of Object.keys(r).sort(compareAsc)) {
    sorted[key] = r[key];
  }
  return sorted;
}
