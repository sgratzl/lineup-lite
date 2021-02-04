/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ColumnInstance, Row } from 'react-table';
import { histGroupBy } from './histGroupBy';

export function dateGroupBy<D extends object = {}>(
  rows: Row<D>[],
  column: ColumnInstance<D>
): Record<string, Row<D>[]> {
  return histGroupBy<D, Date>(rows, column);
}
