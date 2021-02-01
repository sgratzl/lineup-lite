/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { Row } from 'react-table';
import { ITextStats, isTextStats } from '@lineup-lite/components';
import { compareAsc } from './internal';

export function textGroupCompare(a: Row<any>, b: Row<any>, columnId: string): number {
  const av: ITextStats = a.values[columnId];
  const bv: ITextStats = b.values[columnId];
  if (isTextStats(av) && isTextStats(bv)) {
    return compareAsc(av.mostFrequent[0]?.count, bv.mostFrequent[0]?.count);
  }
  return compareAsc(av, bv);
}
