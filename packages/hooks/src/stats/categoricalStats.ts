/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { CategoricalStatsOptions, categoricalStatsGenerator, ICategoricalStats } from '@lineup-lite/components';

export type { CategoricalStatsOptions, ICategoricalStats } from '@lineup-lite/components';

function compute(
  gen: ReturnType<typeof categoricalStatsGenerator>,
  arr: readonly string[],
  preFilter?: ICategoricalStats
) {
  if (!preFilter) {
    return gen(arr);
  }
  const stats = gen(arr);
  const lookup = new Map(stats.hist.map((bin) => [bin.x0, bin]));
  // ensure the same hist structure
  const hist = preFilter.hist.map((bin) => ({ ...bin, ...(lookup.get(bin.x0) ?? { count: 0 }) }));
  return Object.assign(stats, {
    hist,
  });
}

/**
 * generator for computing categorical stats
 */
export function categoricalStats(
  options: CategoricalStatsOptions = {}
): (arr: readonly string[], preFilter?: ICategoricalStats) => ICategoricalStats {
  const gen = categoricalStatsGenerator(options);
  return compute.bind(undefined, gen);
}
