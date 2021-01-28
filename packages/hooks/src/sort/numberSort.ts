import type { Row } from 'react-table';
import { INumberStats, isNumberStats } from '@lineup-lite/components';
import { compareAsc } from './internal';

export function numberGroupCompare(a: Row<any>, b: Row<any>, columnId: string): number {
  const av: INumberStats = a.values[columnId];
  const bv: INumberStats = b.values[columnId];
  if (isNumberStats(av) && isNumberStats(bv)) {
    return compareAsc(av.mean, bv.mean);
  }
  return compareAsc(av, bv);
}
