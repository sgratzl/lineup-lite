import type { RowCompareFunction } from './interfaces';
import type { UseGroupByRowProps, Row } from 'react-table';

function resolveGroupByColumn(a: Row<any>) {
  const g = ((a as unknown) as UseGroupByRowProps<any>).isGrouped;
  if (!g) {
    return null;
  }
  // grouped try to resolve by which column
  console.log(a);
  return '';
}

/**
 * sort helper to compare by a given column id
 * @param a first row
 * @param b second row
 * @param columnId column id
 */
export function sortSplitter(rows: RowCompareFunction, group: RowCompareFunction): RowCompareFunction {
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
