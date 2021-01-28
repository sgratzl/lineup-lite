import type { ICommonStats } from './common';

/**
 * text statistics object
 */
export interface ITextStats extends ICommonStats<string> {
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

export function isTextStats(obj: any): obj is ITextStats {
  return (
    obj != null && typeof (obj as ITextStats).unique === 'number' && Array.isArray((obj as ITextStats).mostFrequent)
  );
}

function toTextString(this: ITextStats) {
  return `TextStats(count=${this.count},mostFrequent=(${this.mostFrequent
    .map((d) => `${d.value}=${d.count}`)
    .join(', ')}))`;
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
    const items: string[] = [];
    arr.forEach((v) => {
      if (!v) {
        missing++;
      } else if (counter.has(v)) {
        counter.get(v)!.count++;
        items.push(v);
      } else {
        counter.set(v, { value: v, count: 1 });
        items.push(v);
      }
    });
    const r: ITextStats = {
      unique: counter.size,
      items,
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
    r.toString = toTextString;
    return r;
  };
}
