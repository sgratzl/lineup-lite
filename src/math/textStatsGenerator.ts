export interface ITextStats {
  readonly count: number;
  readonly missing: number;

  readonly unique: number;
  readonly mostFrequent: readonly { value: string; count: number }[];

  format: (v: string) => string;
}

export interface TextStatsOptions {
  mostFrequentCount?: number;
  format?: (v: string) => string;
}

export function textStatsGenerator(options: TextStatsOptions = {}) {
  const mostFrequentCount = options.mostFrequentCount ?? 10;
  const format = options.format ?? ((v: string) => (v ? v.toString() : v));

  return (arr: readonly string[]): ITextStats => {
    let missing = 0;
    const counter = new Map<string, { value: string; count: number }>();
    for (const v of arr) {
      if (!v) {
        missing++;
      } else if (counter.has(v)) {
        counter.get(v)!.count++;
      } else {
        counter.set(v, { value: v, count: 1 });
      }
    }
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
