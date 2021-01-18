import type { ITextStats, TextStatsOptions } from '@lineup-lite/components';
import { textStatsGenerator } from '@lineup-lite/components';

export function textStats(
  options: TextStatsOptions = {}
): (arr: readonly string[], preFilter?: ITextStats) => ITextStats {
  return textStatsGenerator(options);
}
