/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { Row } from 'react-table';
import type { UnknownObject } from '../interfaces';
import { compareAsc } from './internal';

/**
 * sort helper to compare by a given column id
 * @param a first row
 * @param b second row
 * @param columnId column id
 */
export default function sortCompare(a: Row<UnknownObject>, b: Row<UnknownObject>, columnId: string): number {
  const va = a.values[columnId];
  const vb = b.values[columnId];
  return compareAsc(va, vb);
}
