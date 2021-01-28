import { defaultCategoricalColorScale } from './defaults';
import { IHistStats, maxHistBin, toHistString } from './common';

/**
 * categorical statistics object
 */
export interface ICategoricalStats extends IHistStats<string> {
  categories: readonly string[];
}

export function isCategoricalStats(obj: any): obj is ICategoricalStats {
  return (
    obj != null &&
    Array.isArray((obj as ICategoricalStats).categories) &&
    Array.isArray((obj as ICategoricalStats).hist)
  );
}

export interface CategoricalStatsOptions {
  /**
   * defines the color function to convert a value to a color. By default colors are automatically assigned
   * @default defaultCategoricalColorScale
   */
  color?: (v: string) => string;
  /**
   * defines the label function
   */
  format?: (v: string) => string;
  /**
   * defines the list of categories
   */
  categories?: readonly string[];
}

function toCategoricalString(this: ICategoricalStats) {
  return `CategoricalStats(count=${this.count}, hist=${toHistString(this.hist)})`;
}

export function categoricalStatsGenerator(
  options: CategoricalStatsOptions = {}
): (arr: readonly string[]) => ICategoricalStats {
  const color = options.color ?? defaultCategoricalColorScale();
  const format = options.format ?? ((v: string) => v);

  return (arr: readonly string[]): ICategoricalStats => {
    let missing = 0;
    const map = new Map<string, number>();
    if (options.categories) {
      options.categories.forEach((cat) => map.set(cat, 0));
    }
    const items: string[] = [];
    arr.forEach((v) => {
      if (v == null) {
        missing++;
        return;
      }
      items.push(v);
      map.set(v, 1 + (map.get(v) ?? 0));
    });

    // if categories are given, keep the order
    const entries = options.categories
      ? options.categories.map((c) => [c, map.get(c)!] as [string, number])
      : Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));

    const hist = entries.map(([value, count]) => ({
      x0: value,
      x1: value,
      label: value,
      count,
      items: Array(count).fill(value),
      color: color(value),
    }));

    const r: ICategoricalStats = {
      categories: options.categories ?? hist.map((d) => d.x0),
      hist,
      items,
      maxBin: maxHistBin(hist)!,
      color,
      format,
      missing,
      count: arr.length,
    };
    r.toString = toCategoricalString;
    return r;
  };
}
