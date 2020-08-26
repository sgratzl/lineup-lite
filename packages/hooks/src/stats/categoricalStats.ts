import { CategoricalStatsOptions, categoricalStatsGenerator, ICategoricalStats } from '../math';
import { isStatsOptions } from './utils';

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
  const hist = preFilter.hist.map((bin) => Object.assign({}, bin, lookup.get(bin.x0) ?? { count: 0 }));
  return Object.assign(stats, {
    hist,
  });
}

export function categoricalStats(
  options: CategoricalStatsOptions
): (arr: readonly string[], preFilter?: ICategoricalStats) => ICategoricalStats;
export function categoricalStats(arr: readonly string[], preFilter?: ICategoricalStats): ICategoricalStats;
export function categoricalStats(
  optionsOrArr: CategoricalStatsOptions | readonly string[],
  preFilter?: ICategoricalStats
) {
  if (isStatsOptions(optionsOrArr)) {
    const gen = categoricalStatsGenerator(optionsOrArr);
    return compute.bind(undefined, gen);
  }
  return compute(categoricalStatsGenerator({}), optionsOrArr, preFilter);
}
