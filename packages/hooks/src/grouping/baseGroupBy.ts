/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ColumnInstance, Row } from 'react-table';
import type { AnyObject, UnknownObject } from '../interfaces';
import { compareAsc } from '../sort/internal';
import { MISSING_GROUP } from './histGroupBy';

export default function baseGroupBy<D extends AnyObject = UnknownObject>(
  rows: Row<D>[],
  column: ColumnInstance<D>,
  acc: (v: unknown) => string | null = (v) => (v ? String(v) : null)
): Record<string, Row<D>[]> {
  const r: Record<string, Row<D>[]> = {};
  for (const row of rows) {
    const value = acc(row.values[column.id]) ?? MISSING_GROUP;
    const rValue = r[value];
    if (!rValue) {
      r[value] = [row];
    } else {
      rValue.push(row);
    }
  }
  // sort by key asc
  const sorted: Record<string, Row<D>[]> = {};
  for (const key of Object.keys(r).sort(compareAsc)) {
    sorted[key] = r[key];
  }
  return sorted;
}
