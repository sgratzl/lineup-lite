/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { Row, IdType, defaultGroupByFn, Cell } from 'react-table';
import type { UseGroupingOptionsColumnProps } from '../hooks/useGroupingOptions';
import type { AnyObject, LineUpLiteGroupByFunction, UnknownObject, UseColumnGroupByColumnOptions } from '../interfaces';

function hasGroupByFunction<D extends AnyObject = UnknownObject>(
  cell?: unknown
): cell is { column: { groupBy: LineUpLiteGroupByFunction<D> } } {
  return (
    cell != null &&
    (cell as Cell<D, AnyObject>).column != null &&
    typeof ((cell as Cell<D, AnyObject>).column as UseColumnGroupByColumnOptions<D>).groupBy === 'function'
  );
}
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
  const cell: Cell<D, AnyObject> | undefined = rows[0].allCells?.find((d) => d.column.id === columnId);
  if (hasGroupByFunction<D>(cell)) {
    return cell.column.groupBy(
      rows,
      cell.column,
      (cell.column as Partial<UseGroupingOptionsColumnProps>).groupingOptions
    );
  }
  return defaultGroupByFn(rows, columnId);
}
