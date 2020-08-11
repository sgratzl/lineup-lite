import {
  CategoricalStatsOptions,
  categoricalStatsGenerator,
  ICategoricalStats,
} from '../math/categoricalStatsGenerator';

export interface CategoricalStats extends ICategoricalStats {
  preFilter?: ICategoricalStats;
}

export function categoricalStats(options: CategoricalStatsOptions = {}) {
  const gen = categoricalStatsGenerator(options);
  return (arr: readonly string[], preFilter?: readonly string[]) => {
    if (!preFilter) {
      return gen(arr);
    }
    const stats = gen(arr) as CategoricalStats;
    const raw = gen(preFilter);
    const lookup = new Map(stats.hist.map((bin) => [bin.x0, bin]));
    // ensure the same hist structure
    const hist = raw.hist.map((bin) => Object.assign({}, bin, lookup.get(bin.x0) ?? { count: 0 }));
    return Object.assign(stats, {
      hist,
      preFilter: raw,
    });
  };
}
