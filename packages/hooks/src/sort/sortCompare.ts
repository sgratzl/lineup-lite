import type { Row } from 'react-table';
import { compareAsc } from './internal';

/**
 * sort helper to compare by a given column id
 * @param a first row
 * @param b second row
 * @param columnId column id
 */
export function sortCompare(a: Row<any>, b: Row<any>, columnId: string): number {
  const va = a.values[columnId];
  const vb = b.values[columnId];
  return compareAsc(va, vb);
}
