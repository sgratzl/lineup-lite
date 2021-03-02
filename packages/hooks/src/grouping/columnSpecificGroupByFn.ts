/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { Row, IdType, defaultGroupByFn } from 'react-table';
import type { AnyObject, UnknownObject, UseColumnGroupByColumnOptions } from '../interfaces';

/**
 * helper function to defer the grouping logic to the column
 * @param rows
 * @param columnId
 */
export default function columnSpecificGroupByFn<D extends AnyObject = UnknownObject>(
  rows: Row<D>[],
  columnId: IdType<D>
): Record<string, Row<D>[]> {
  if (rows.length === 0 || rows[0] == null || rows[0].allCells == null) {
    return {};
  }
  const column = rows[0].allCells.find((d) => d.column.id === columnId);
  if (column && typeof (column.column as UseColumnGroupByColumnOptions<D>).groupBy) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (column.column as UseColumnGroupByColumnOptions<D>).groupBy!(rows, column.column);
  }
  return defaultGroupByFn(rows, columnId);
}
