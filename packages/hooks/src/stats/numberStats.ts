import { numberStatsGenerator, NumberStatsOptions, INumberStats } from '../math';

export function numberStats(options: NumberStatsOptions = {}) {
  const gen = numberStatsGenerator(options);
  return (arr: readonly number[], preFilter?: INumberStats): INumberStats => {
    if (!preFilter) {
      return gen(arr);
    }
    const rawOptions: NumberStatsOptions = Object.assign(
      { min: preFilter.min, max: preFilter.max, numberOfBins: preFilter.hist.length } as NumberStatsOptions,
      options
    );
    // ensure the same hist structure
    return numberStatsGenerator(rawOptions)(arr);
  };
}
