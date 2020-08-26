import { ITextStats, TextStatsOptions } from '../math';
import { isStatsOptions } from './utils';

import { textStatsGenerator } from '../math';

function compute(gen: ReturnType<typeof textStatsGenerator>, arr: readonly string[]) {
  return gen(arr);
}

export function textStats(options: TextStatsOptions): (arr: readonly string[], preFilter?: ITextStats) => ITextStats;
export function textStats(arr: readonly string[], preFilter?: ITextStats): ITextStats;
export function textStats(optionsOrArr: TextStatsOptions | readonly string[]) {
  if (isStatsOptions(optionsOrArr)) {
    return textStatsGenerator(optionsOrArr);
  }
  return compute(textStatsGenerator({}), optionsOrArr);
}
