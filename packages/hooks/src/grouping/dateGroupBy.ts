/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ColumnInstance, Row } from 'react-table';
import type { AnyObject, LineUpLiteGroupByFunction, UnknownObject } from '../interfaces';
import { histGroupBy } from './histGroupBy';

export default function dateGroupBy<D extends AnyObject = UnknownObject>(
  rows: readonly Row<D>[],
  column: ColumnInstance<D>
): Record<string, Row<D>[]> {
  // TODO options
  return histGroupBy<D, Date>(rows, column);
}

export function dateGroupByFactory<D extends AnyObject = UnknownObject>(): LineUpLiteGroupByFunction<D> {
  return dateGroupBy;
}
