import { defaultCategoricalColorScale } from './defaults';
import { IHistStats } from './common';

export interface ICategoricalStats extends IHistStats<string> {}

export interface CategoricalStatsOptions {
  color?: (v: string) => string;
  format?: (v: string) => string;
}

export function categoricalStatsGenerator(options: CategoricalStatsOptions = {}) {
  const color = options.color ?? defaultCategoricalColorScale();
  const format = options.format ?? ((v: string) => v);

  return (arr: readonly string[]): ICategoricalStats => {
    let missing = 0;
    const map = new Map<string, number>();
    for (const v of arr) {
      if (v == null) {
        missing++;
        continue;
      }
      map.set(v, 1 + (map.get(v) ?? 0));
    }
    const hist = Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([value, count]) => ({
        x0: value,
        x1: value,
        count,
        color: color(value),
      }));
    return {
      hist,
      maxBin: hist.reduce((acc, b) => Math.max(acc, b.count), 0),
      color,
      format,
      missing,
      count: arr.length,
    };
  };
}