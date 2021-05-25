/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ColumnInstance, Row } from 'react-table';
import type { AnyObject, UnknownObject } from '../interfaces';
import baseGroupBy, { sortGroups } from './baseGroupBy';
import { MISSING_GROUP, OTHERS_GROUPS } from './histGroupBy';

export interface TextGroupByValueOptions {
  type: 'value';
  values: string[];
}
export interface TextGroupByRegexOptions {
  type: 'regex';
  values: RegExp[];
}
export interface TextGroupByStartsWithOptions {
  type: 'startsWith';
  values: string[];
}

export type TextGroupByOptions = TextGroupByValueOptions | TextGroupByStartsWithOptions | TextGroupByRegexOptions;

export default function textGroupBy<D extends AnyObject = UnknownObject>(
  rows: readonly Row<D>[],
  column: ColumnInstance<D>,
  options?: TextGroupByOptions
): Record<string, Row<D>[]> {
  if (!options) {
    return baseGroupBy(rows, column);
  }
  const r: Record<string, Row<D>[]> = {};

  let toGroup = (v: string | null) => v || MISSING_GROUP;
  switch (options.type) {
    case 'regex':
      toGroup = (v) => options.values.find((d) => v != null && d.test(v))?.source ?? OTHERS_GROUPS;
      break;
    case 'value':
      toGroup = (v) => options.values.find((d) => v != null && d === v) ?? OTHERS_GROUPS;
      break;
    case 'startsWith':
      toGroup = (v) => options.values.find((d) => v != null && v.startsWith(d)) ?? OTHERS_GROUPS;
      break;
  }

  for (const row of rows) {
    const v = row.values[column.id] ?? null;
    const g = v != null ? toGroup(v) : MISSING_GROUP;
    const rValue = r[g];
    if (!rValue) {
      r[g] = [row];
    } else {
      rValue.push(row);
    }
  }
  return sortGroups(r);
}

export function textGroupByFactory<D extends AnyObject = UnknownObject>(
  options: TextGroupByOptions
): (rows: readonly Row<D>[], column: ColumnInstance<D>, options?: TextGroupByOptions) => Record<string, Row<D>[]> {
  return (rows, column, o?: TextGroupByOptions) => textGroupBy<D>(rows, column, o ?? options);
}
