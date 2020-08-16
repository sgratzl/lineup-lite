import { textStatsGenerator, ITextStats, TextStatsOptions } from '../math/textStatsGenerator';

export interface TextStats extends ITextStats {
  preFilter?: ITextStats;
}

export function textStats(options: TextStatsOptions = {}) {
  const gen = textStatsGenerator(options);
  return (arr: readonly string[], preFilter?: readonly string[]): TextStats => {
    if (!preFilter) {
      return gen(arr);
    }
    const stats = gen(arr) as TextStats;
    const raw = gen(preFilter);
    return Object.assign(stats, {
      preFilter: raw,
    });
  };
}

export function textAggregate(options: TextStatsOptions = {}) {
  const gen = textStatsGenerator(options);
  return (arr: readonly string[]): TextStats => {
    return gen(arr);
  };
}
