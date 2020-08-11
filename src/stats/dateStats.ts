import { DateStatsOptions, dateStatsGenerator } from '../math/dateStatsGenerator';

export function dateStats(options: DateStatsOptions = {}) {
  const gen = dateStatsGenerator(options);
  return gen;
}
