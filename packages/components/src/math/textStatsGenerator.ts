import type { ICommonStats } from './common';

/**
 * text statistics object
 */
export interface ITextStats extends ICommonStats {
  /**
   * number of unique text items
   */
  readonly unique: number;
  /**
   * top 10 most frequent text items sorted descending by count
   */
  readonly mostFrequent: readonly { value: string; count: number }[];
  /**
   * converts a given string to a label
   */
  format: (v: string) => string;
}

export interface TextStatsOptions {
  /**
   * number of most frequent items to include in the stats
   * @default 10
   */
  mostFrequentCount?: number;
  /**
   * defines the label function to use
   * @default (v) => v
   */
  format?: (v: string) => string;
}

/**
 * text statistics generator
 */
export function textStatsGenerator(options: TextStatsOptions = {}): (arr: readonly string[]) => ITextStats {
  const mostFrequentCount = options.mostFrequentCount ?? 10;
  const format = options.format ?? ((v: string) => (v ? v.toString() : v));

  return (arr: readonly string[]): ITextStats => {
    let missing = 0;
    const counter = new Map<string, { value: string; count: number }>();
    arr.forEach((v) => {
      if (!v) {
        missing++;
      } else if (counter.has(v)) {
        counter.get(v)!.count++;
      } else {
        counter.set(v, { value: v, count: 1 });
      }
    });
    return {
      unique: counter.size,
      mostFrequent:
        mostFrequentCount <= 0
          ? []
          : Array.from(counter.values())
              .sort((a, b) => (a.count !== b.count ? b.count - a.count : a.value.localeCompare(b.value)))
              .slice(0, mostFrequentCount),
      missing,
      count: arr.length,
      format,
    };
  };
}
