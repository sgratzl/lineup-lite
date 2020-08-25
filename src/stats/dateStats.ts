import { dateStatsGenerator, DateStatsOptions, IDateStats } from '../math';

export function dateStats(options: DateStatsOptions = {}) {
  const gen = dateStatsGenerator(options);
  return (arr: readonly (Date | null)[], preFilter?: IDateStats): IDateStats => {
    if (!preFilter) {
      return gen(arr);
    }
    const rawOptions: DateStatsOptions = Object.assign(
      { min: preFilter.min, max: preFilter.max, histGranularity: preFilter.histGranularity } as DateStatsOptions,
      options
    );
    // ensure the same hist structure
    return dateStatsGenerator(rawOptions)(arr);
  };
}
