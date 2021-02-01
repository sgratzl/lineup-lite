/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { Row, IdType, defaultGroupByFn } from 'react-table';

/**
 * helper function to defer the grouping logic to the column
 * @param rows
 * @param columnId
 */
export function columnSpecificGroupByFn<D extends object = {}>(
  rows: Row<D>[],
  columnId: IdType<D>
): Record<string, Row<D>[]> {
  if (rows.length === 0 || rows[0] == null || rows[0].allCells == null) {
    return {};
  }
  const column = rows[0].allCells.find((d) => d.column.id === columnId);
  if (column && typeof (column.column as any).groupBy) {
    return (column.column as any).groupBy(rows, column.column);
  }
  return defaultGroupByFn(rows, columnId);
}
