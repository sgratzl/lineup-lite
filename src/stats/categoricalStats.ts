import { CategoricalStatsOptions, categoricalStatsGenerator } from '../math/categoricalStatsGenerator';

export function categoricalStats(options: CategoricalStatsOptions = {}) {
  const gen = categoricalStatsGenerator(options);
  return gen;
}
