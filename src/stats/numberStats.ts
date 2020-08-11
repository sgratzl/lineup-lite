import { numberStatsGenerator, NumberStatsOptions } from '../math/numberStatsGenerator';

export function numberStats(options: NumberStatsOptions = {}) {
  const gen = numberStatsGenerator(options);
  return gen;
}
