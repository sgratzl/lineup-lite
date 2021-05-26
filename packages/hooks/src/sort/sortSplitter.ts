/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { UseGroupByRowProps, Row } from 'react-table';
import type { UseSortingOptionsColumnProps } from '../hooks';
import type { UnknownObject } from '../interfaces';
import type { AnyObject } from '../types';
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

function resolveSortOptions<O extends AnyObject = UnknownObject>(
  a: Row<UnknownObject>,
  columnId: string
): undefined | O {
  const column = a.allCells?.find((d) => d.column.id === columnId)?.column;
  if (!column) {
    return undefined;
  }
  return (column as Partial<UseSortingOptionsColumnProps>).sortingOptions;
}

/**
 * sort helper to compare by a given column id
 * @param a first row
 * @param b second row
 * @param columnId column id
 */
export default function sortSplitter<O extends AnyObject = UnknownObject>(
  rows: RowCompareFunction<O>,
  group: RowCompareFunction<O>
): RowCompareFunction {
  return (a, b, columnId) => {
    const aGroupByColumn = resolveGroupByColumn(a);
    const bGroupByColumn = resolveGroupByColumn(b);
    const options = resolveSortOptions<O>(a, columnId);

    if ((!aGroupByColumn || aGroupByColumn === columnId) && (!bGroupByColumn || bGroupByColumn === columnId)) {
      return rows(a, b, columnId, options);
    }
    if (aGroupByColumn && bGroupByColumn) {
      return group(a, b, columnId, options);
    }
    return rows(a, b, columnId, options);
  };
}
