import { CategoricalStatsOptions, categoricalStatsGenerator, ICategoricalStats } from '../math';

export function categoricalStats(options: CategoricalStatsOptions = {}) {
  const gen = categoricalStatsGenerator(options);
  return (arr: readonly string[], preFilter?: ICategoricalStats): ICategoricalStats => {
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
  };
}
