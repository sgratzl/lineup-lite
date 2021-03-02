/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ITextStats, TextStatsOptions } from '@lineup-lite/components';
import { textStatsGenerator } from '@lineup-lite/components';

export type { TextStatsOptions, ITextStats } from '@lineup-lite/components';

/**
 * generator for computing text stats
 */
export function textStats(
  options: TextStatsOptions = {}
): (arr: readonly string[], preFilter?: ITextStats) => ITextStats {
  return textStatsGenerator(options);
}
