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
import type { RowCompareFunction } from './interfaces';
import { compareAsc } from './internal';

export interface NumberSortOptions {
  group: 'median' | 'min' | 'max' | 'mean' | 'q1' | 'q3';
  array: 'median' | 'min' | 'max' | 'mean' | 'q1' | 'q3';
}

export function numberGroupCompare(
  a: Row<UnknownObject>,
  b: Row<UnknownObject>,
  columnId: string,
  options?: NumberSortOptions
): number {
  const group = options?.group ?? 'median';
  const av: INumberStats = a.values[columnId];
  const bv: INumberStats = b.values[columnId];
  if (isNumberStats(av) && isNumberStats(bv)) {
    return compareAsc(av[group], bv[group]);
  }
  return compareAsc(av, bv);
}

export function numbersCompare(
  a: Row<UnknownObject>,
  b: Row<UnknownObject>,
  columnId: string,
  options?: NumberSortOptions
): number {
  const group = options?.group ?? 'median';
  const column = a.allCells?.find((d) => d.column.id === columnId)?.column;
  const av = computeArrayNumberStats(a.values[columnId], column);
  const bv = computeArrayNumberStats(b.values[columnId], column);
  if (isNumberStats(av) && isNumberStats(bv)) {
    return compareAsc(av[group], bv[group]);
  }
  return compareAsc(av, bv);
}

export function numberGroupCompareFactory(options: NumberSortOptions): RowCompareFunction<NumberSortOptions> {
  return (a, b, columId, o) => numberGroupCompare(a, b, columId, o ?? options);
}

export function numbersCompareFactory(options: NumberSortOptions): RowCompareFunction<NumberSortOptions> {
  return (a, b, columId, o) => numbersCompare(a, b, columId, o ?? options);
}
