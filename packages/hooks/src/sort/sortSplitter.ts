/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { UseGroupByRowProps, Row } from 'react-table';
import type { UnknownObject } from '../interfaces';
import type { RowCompareFunction } from './interfaces';

function resolveGroupByColumn(a: Row<UnknownObject>) {
  const g = (a as unknown as UseGroupByRowProps<UnknownObject>).isGrouped;
  if (!g) {
    return null;
  }
  // grouped try to resolve by which column
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (a as any).groupByID;
}

/**
 * sort helper to compare by a given column id
 * @param a first row
 * @param b second row
 * @param columnId column id
 */
export default function sortSplitter(rows: RowCompareFunction, group: RowCompareFunction): RowCompareFunction {
  return (a, b, columnId) => {
    const aGroupByColumn = resolveGroupByColumn(a);
    const bGroupByColumn = resolveGroupByColumn(b);

    if ((!aGroupByColumn || aGroupByColumn === columnId) && (!bGroupByColumn || bGroupByColumn === columnId)) {
      return rows(a, b, columnId);
    }
    if (aGroupByColumn && bGroupByColumn) {
      return group(a, b, columnId);
    }
    return rows(a, b, columnId);
  };
}
