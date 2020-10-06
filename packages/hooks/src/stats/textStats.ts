import { ITextStats, TextStatsOptions } from '@lineup-lite/components';
import { isStatsOptions } from './utils';

import { textStatsGenerator } from '@lineup-lite/components';

function compute(gen: ReturnType<typeof textStatsGenerator>, arr: readonly string[]) {
  return gen(arr);
}

export function textStats(options: TextStatsOptions): (arr: readonly string[], preFilter?: ITextStats) => ITextStats;
// eslint-disable-next-line no-redeclare
export function textStats(arr: readonly string[], preFilter?: ITextStats): ITextStats;
// eslint-disable-next-line no-redeclare
export function textStats(optionsOrArr: TextStatsOptions | readonly string[]) {
  if (isStatsOptions(optionsOrArr)) {
    return textStatsGenerator(optionsOrArr);
  }
  return compute(textStatsGenerator({}), optionsOrArr);
}
