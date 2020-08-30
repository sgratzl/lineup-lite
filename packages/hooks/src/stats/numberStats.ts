import { numberStatsGenerator, NumberStatsOptions, INumberStats } from '@lineup-lite/components';
import { isStatsOptions } from './utils';

function compute(
  gen: ReturnType<typeof numberStatsGenerator>,
  options: NumberStatsOptions,
  arr: readonly number[],
  preFilter?: INumberStats
) {
  if (!preFilter) {
    return gen(arr);
  }
  const rawOptions: NumberStatsOptions = Object.assign(
    { min: preFilter.min, max: preFilter.max, numberOfBins: preFilter.hist.length } as NumberStatsOptions,
    options
  );
  // ensure the same hist structure
  return numberStatsGenerator(rawOptions)(arr);
}

export function numberStats(
  options: NumberStatsOptions
): (arr: readonly number[], preFilter?: INumberStats) => INumberStats;
export function numberStats(arr: readonly number[], preFilter?: INumberStats): INumberStats;
export function numberStats(optionsOrArr: NumberStatsOptions | readonly number[], preFilter?: INumberStats) {
  if (isStatsOptions(optionsOrArr)) {
    const gen = numberStatsGenerator(optionsOrArr);
    return compute.bind(undefined, gen, optionsOrArr);
  }
  return compute(numberStatsGenerator({}), {}, optionsOrArr, preFilter);
}
