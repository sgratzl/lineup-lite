/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ColumnInstance, Row } from 'react-table';
import type { AnyObject, UnknownObject } from '../interfaces';
import { compareAsc } from '../sort/internal';
import { MISSING_GROUP, OTHERS_GROUPS } from './histGroupBy';

function toSpecialIndex(v: string) {
  if (v === MISSING_GROUP) {
    return 2;
  }
  if (v === OTHERS_GROUPS) {
    return 1;
  }
  return 0;
}

export function compareMissing(a: string, b: string): number {
  const aIndex = toSpecialIndex(a);
  const bIndex = toSpecialIndex(b);

  if (aIndex !== bIndex) {
    return aIndex - bIndex;
  }
  return compareAsc(a, b);
}
export function sortGroups<D extends AnyObject = UnknownObject>(r: Record<string, Row<D>[]>): Record<string, Row<D>[]> {
  // sort by key asc
  const sorted: Record<string, Row<D>[]> = {};
  for (const key of Object.keys(r).sort(compareMissing)) {
    sorted[key] = r[key];
  }
  return sorted;
}

export default function baseGroupBy<D extends AnyObject = UnknownObject>(
  rows: readonly Row<D>[],
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
  return sortGroups(r);
}
