import { defaultCategoricalColorScale } from '../renderers/defaults';
import { ICommonStats } from './common';

export interface ICategoricalStats extends ICommonStats<string> {}

export interface CategoricalStatsOptions {
  color?: (v: string) => string;
}

export function categoricalStats(options: CategoricalStatsOptions = {}) {
  const color = options.color ?? defaultCategoricalColorScale();

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
      format: (v) => v,
      missing,
      count: arr.length,
    };
  };
}
