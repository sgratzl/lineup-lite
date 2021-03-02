/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { INumberStats, isNumberStats } from '@lineup-lite/components';
import type { Row } from 'react-table';
import type { UnknownObject } from '../interfaces';
import { computeArrayNumberStats } from '../stats';
import { compareAsc } from './internal';

export function numberGroupCompare(a: Row<UnknownObject>, b: Row<UnknownObject>, columnId: string): number {
  const av: INumberStats = a.values[columnId];
  const bv: INumberStats = b.values[columnId];
  if (isNumberStats(av) && isNumberStats(bv)) {
    return compareAsc(av.median, bv.median);
  }
  return compareAsc(av, bv);
}

export function numbersCompare(a: Row<UnknownObject>, b: Row<UnknownObject>, columnId: string): number {
  const column = a.allCells.find((d) => d.column.id === columnId)?.column;
  const av = computeArrayNumberStats(a.values[columnId], column);
  const bv = computeArrayNumberStats(b.values[columnId], column);
  if (isNumberStats(av) && isNumberStats(bv)) {
    return compareAsc(av.median, bv.median);
  }
  return compareAsc(av, bv);
}
