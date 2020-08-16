import { dateStatsGenerator, DateStatsOptions, IDateStats } from '../math/dateStatsGenerator';

export interface DateStats extends IDateStats {
  preFilter?: IDateStats;
}

export function dateStats(options: DateStatsOptions = {}) {
  const gen = dateStatsGenerator(options);
  return (arr: readonly (Date | null)[], preFilter?: readonly (Date | null)[]): DateStats => {
    if (!preFilter) {
      return gen(arr);
    }
    const raw = gen(preFilter);
    const rawOptions: DateStatsOptions = Object.assign(
      { min: raw.min, max: raw.max, histGranularity: raw.histGranularity } as DateStatsOptions,
      options
    );
    // ensure the same hist structure
    const stats = dateStatsGenerator(rawOptions)(arr) as DateStats;
    return Object.assign(stats, {
      preFilter: raw,
    });
  };
}

export function dateAggregate(options: DateStatsOptions = {}) {
  const gen = dateStatsGenerator(options);
  return (arr: readonly (Date | null)[]): DateStats => {
    return gen(arr);
  };
}
