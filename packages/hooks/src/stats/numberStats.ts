import { numberStatsGenerator, NumberStatsOptions, INumberStats } from '@lineup-lite/components';

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
/**
 * generator for computing number stats
 */
export function numberStats(
  options: NumberStatsOptions = {}
): (arr: readonly number[], preFilter?: INumberStats) => INumberStats {
  const gen = numberStatsGenerator(options);
  return compute.bind(undefined, gen, options);
}
