/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { numberStatsGenerator, NumberStatsOptions, INumberStats } from '@lineup-lite/components';
import type { ColumnInstance } from 'react-table';
import type { UseStatsColumnOptions, UseStatsColumnProps } from '../hooks';

function compute(
  gen: ReturnType<typeof numberStatsGenerator>,
  options: NumberStatsOptions,
  arr: readonly number[],
  preFilter?: INumberStats
) {
  if (!preFilter) {
    return gen(arr);
  }
  const rawOptions: NumberStatsOptions = Object.assign(
    { min: preFilter.min, max: preFilter.max, numberOfBins: preFilter.hist.length } as NumberStatsOptions,
    options
  );
  // ensure the same hist structure
  return numberStatsGenerator(rawOptions)(arr);
}
/**
 * generator for computing number stats
 */
export function numberStats(
  options: NumberStatsOptions = {}
): (arr: readonly number[], preFilter?: INumberStats) => INumberStats {
  const gen = numberStatsGenerator(options);
  return compute.bind(undefined, gen, options);
}

export type NumberArrayWithStats = number[] & { _stats?: INumberStats };

export function computeArrayNumberStats(
  arr: NumberArrayWithStats,
  column?: ColumnInstance<any> & Partial<UseStatsColumnOptions<any> & UseStatsColumnProps>
): INumberStats | null {
  if (arr == null) {
    return null;
  }
  if (arr._stats) {
    return arr._stats;
  }
  // cache stats to avoid recomputing
  arr._stats = (column?.stats ?? numberStatsGenerator())(arr, column?.preFilterStatsValue ?? column?.statsValue);
  return arr._stats!;
}
