/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ColumnInstance, Row } from 'react-table';
import type { UnknownObject } from '../interfaces';
import baseGroupBy from './baseGroupBy';

export default function textGroupBy<D extends UnknownObject = UnknownObject>(
  rows: Row<D>[],
  column: ColumnInstance<D>
): Record<string, Row<D>[]> {
  const base = baseGroupBy(rows, column);

  // sort groups by value not by first come first ordered
  const sorted: Record<string, Row<D>[]> = {};
  Object.entries(base)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([key, value]) => {
      sorted[key] = value;
    });
  return base;
}
