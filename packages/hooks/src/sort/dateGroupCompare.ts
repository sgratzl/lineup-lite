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
import type { RowCompareFunction } from './interfaces';

export interface DateSortOptions {
  group: 'median' | 'min' | 'max';
}

export default function dateGroupCompare(
  a: Row<UnknownObject>,
  b: Row<UnknownObject>,
  columnId: string,
  options?: DateSortOptions
): number {
  const group = options?.group ?? 'min';
  const av: IDateStats = a.values[columnId];
  const bv: IDateStats = b.values[columnId];
  if (isDateStats(av) && isDateStats(bv)) {
    return compareAsc(av[group], bv[group]);
  }
  return compareAsc(av, bv);
}

export function dateGroupCompareFactory(options: DateSortOptions): RowCompareFunction<DateSortOptions> {
  return (a, b, columId, o) => dateGroupCompare(a, b, columId, o ?? options);
}
