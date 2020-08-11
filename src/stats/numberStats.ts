import { numberStatsGenerator, NumberStatsOptions, INumberStats } from '../math/numberStatsGenerator';

export interface NumberStats extends INumberStats {
  preFilter?: INumberStats;
}

export function numberStats(options: NumberStatsOptions = {}) {
  const gen = numberStatsGenerator(options);
  return (arr: readonly number[], preFilter?: readonly number[]) => {
    if (!preFilter) {
      return gen(arr);
    }
    const raw = gen(preFilter);
    const rawOptions: NumberStatsOptions = Object.assign(
      { min: raw.min, max: raw.max, numberOfBins: raw.hist.length } as NumberStatsOptions,
      options
    );
    // ensure the same hist structure
    const stats = numberStatsGenerator(rawOptions)(arr) as NumberStats;
    return Object.assign(stats, {
      preFilter: raw,
    });
  };
}
