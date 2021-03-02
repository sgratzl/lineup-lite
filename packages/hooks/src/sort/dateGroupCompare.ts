/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { Row } from 'react-table';
import { IDateStats, isDateStats } from '@lineup-lite/components';
import { compareAsc } from './internal';
import type { UnknownObject } from '../interfaces';

export default function dateGroupCompare(a: Row<UnknownObject>, b: Row<UnknownObject>, columnId: string): number {
  const av: IDateStats = a.values[columnId];
  const bv: IDateStats = b.values[columnId];
  if (isDateStats(av) && isDateStats(bv)) {
    return compareAsc(av.min, bv.min);
  }
  return compareAsc(av, bv);
}