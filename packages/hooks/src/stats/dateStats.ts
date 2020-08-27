import { dateStatsGenerator, DateStatsOptions, IDateStats } from '@lineup-lite/components';
import { isStatsOptions } from './utils';

function compute(
  gen: ReturnType<typeof dateStatsGenerator>,
  options: DateStatsOptions,
  arr: readonly (Date | null)[],
  preFilter?: IDateStats
) {
  if (!preFilter) {
    return gen(arr);
  }
  const rawOptions: DateStatsOptions = Object.assign(
    { min: preFilter.min, max: preFilter.max, histGranularity: preFilter.histGranularity } as DateStatsOptions,
    options
  );
  // ensure the same hist structure
  return dateStatsGenerator(rawOptions)(arr);
}

export function dateStats(
  options: DateStatsOptions
): (arr: readonly (Date | null)[], preFilter?: IDateStats) => IDateStats;
export function dateStats(arr: readonly (Date | null)[], preFilter?: IDateStats): IDateStats;
export function dateStats(optionsOrArr: DateStatsOptions | readonly (Date | null)[], preFilter?: IDateStats) {
  if (isStatsOptions(optionsOrArr)) {
    const gen = dateStatsGenerator(optionsOrArr);
    return compute.bind(undefined, gen, optionsOrArr);
  }
  return compute(dateStatsGenerator({}), {}, optionsOrArr, preFilter);
}
