/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ColumnInstance, Row } from 'react-table';
import type { AnyObject, UnknownObject } from '../interfaces';
import baseGroupBy from './baseGroupBy';

export default function textGroupBy<D extends AnyObject = UnknownObject>(
  rows: Row<D>[],
  column: ColumnInstance<D>
): Record<string, Row<D>[]> {
  // TODO options
  return baseGroupBy(rows, column);
}
