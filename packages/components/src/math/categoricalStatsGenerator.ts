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

/**
 * helper function to create a formatter between a category value and a category label
 * @param categoryLabel tuple list of [category, label] to map
 */
export function formatCategories(...categoryLabel: [string, string][]) {
  const map = new Map(categoryLabel);
  return (v: string) => map.get(v) ?? v;
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

export type CategoricalValueLike = string | null | undefined | readonly (string | null | undefined)[] | Set<string>;

export function categoricalStatsGenerator(
  options: CategoricalStatsOptions = {}
): (arr: readonly CategoricalValueLike[]) => ICategoricalStats {
  const color = options.color ?? defaultCategoricalColorScale();
  const format = options.format ?? ((v: string) => v);

  return (arr): ICategoricalStats => {
    const map = new Map<string, number>();
    if (options.categories) {
      options.categories.forEach((cat) => map.set(cat, 0));
    }
    let missing = 0;
    const items: (string | readonly string[] | Set<string>)[] = [];
    let flatMissing = 0;
    const flatItems: string[] = [];

    const pushValue = (v: string) => {
      flatItems.push(v);
      map.set(v, 1 + (map.get(v) ?? 0));
    };
    for (const v of arr) {
      if (v == null) {
        missing++;
        flatMissing++;
        continue;
      }
      if (typeof v === 'string') {
        items.push(v);
        pushValue(v);
        continue;
      }
      if (v instanceof Set) {
        items.push(v);
        v.forEach((vi) => pushValue(vi));
        continue;
      }
      const vClean: string[] = [];
      for (const vi of v) {
        if (vi == null) {
          flatMissing++;
        } else {
          pushValue(vi);
          vClean.push(vi);
        }
      }
      if (vClean.length === v.length) {
        items.push(v as string[]);
      } else {
        items.push(vClean);
      }
    }

    // if categories are given, keep the order
    const entries = options.categories
      ? options.categories.map((c) => [c, map.get(c)!] as [string, number])
      : Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));

    const hist = entries.map(([value, count]) => ({
      x0: value,
      x1: value,
      label: format(value),
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
      flatMissing,
      flatItems,
      flatCount: flatItems.length + flatMissing,
    };
    r.toString = toCategoricalString;
    return r;
  };
}
