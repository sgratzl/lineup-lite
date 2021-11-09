/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { defaultConstantColorScale } from './defaults';
import { INumericStats, IBin, toHistString, maxHistBin } from './common';

/**
 * on which granularity level is the histogram computed
 */
export declare type DateHistGranularity = 'year' | 'month' | 'day' | 'decade';

export interface IDateStats extends INumericStats<Date> {
  /**
   * the granularity in which the histogram is computed
   */
  readonly histGranularity: DateHistGranularity;
}

export function isDateStats(obj: unknown): obj is IDateStats {
  return (
    obj != null && typeof (obj as IDateStats).histGranularity === 'string' && Array.isArray((obj as IDateStats).hist)
  );
}

function toDateString(this: IDateStats) {
  const f = (v: Date) => this.format(v);
  return `DateStats(count=${this.count}, min=${f(this.min)}, max=${f(this.max)}, hist=${toHistString(this.hist)})`;
}

function toDatePrimitive(this: IDateStats, hint: 'string' | 'default'): string;
function toDatePrimitive(this: IDateStats, hint: 'number'): number;
function toDatePrimitive(this: IDateStats, hint: 'number' | 'string' | 'default') {
  if (hint === 'string' || hint === 'default') {
    return toDateString.call(this);
  }
  if (hint === 'number') {
    return this.median.valueOf();
  }
  throw new TypeError('invalid hint');
}

/**
 * guesses the histogram granularity to use based on min and max date
 */
function computeGranularity(
  min: Date,
  max: Date,
  color: (v: Date) => string,
  format?: DateFormatter,
  histGranularity?: DateHistGranularity
): { histGranularity: DateHistGranularity; hist: IBin<Date>[] } {
  const hist: IBin<Date>[] = [];

  if (histGranularity === 'decade' || max.getFullYear() - min.getFullYear() >= 30) {
    const formatter = yearFormatter(format);
    // more than 3 decades
    const minYear = Math.floor(min.getFullYear() / 10) * 10;
    const maxYear = max.getFullYear();
    for (let i = minYear; i <= maxYear; i += 10) {
      const x0 = new Date(i, 0, 1);
      hist.push({
        x0,
        x1: new Date(i + 10, 0, 1),
        label: formatter(x0),
        color: color(new Date(i + 5, 0, 1)),
        items: [],
        count: 0,
      });
    }
    return { hist, histGranularity: 'decade' };
  }

  if (histGranularity === 'year' || max.getFullYear() - min.getFullYear() >= 2) {
    // more than two years difference
    const formatter = yearFormatter(format);
    const minYear = min.getFullYear();
    const maxYear = max.getFullYear();
    for (let i = minYear; i <= maxYear; i += 1) {
      const x0 = new Date(i, 0, 1);
      hist.push({
        x0,
        x1: new Date(i + 1, 0, 1),
        label: formatter(x0),
        color: color(new Date(i, 6, 1)),
        items: [],
        count: 0,
      });
    }
    return { hist, histGranularity: 'year' };
  }

  if (histGranularity === 'day' || max.getTime() - min.getTime() <= 1000 * 60 * 60 * 24 * 31) {
    // less than a month use day
    let x0 = new Date(min.getFullYear(), min.getMonth(), min.getDate());
    const formatter = resolveDateFormatter(format);
    while (x0 <= max) {
      const x1 = new Date(x0);
      x1.setDate(x1.getDate() + 1);
      hist.push({
        x0,
        x1,
        label: formatter(x0),
        color: color(new Date(x0.getFullYear(), x0.getMonth(), x0.getDate(), 12)),
        items: [],
        count: 0,
      });
      x0 = x1;
    }
    return { hist, histGranularity: 'day' };
  }

  // by month
  let x0 = new Date(min.getFullYear(), min.getMonth(), 1);
  const formatter = monthFormatter(format);
  while (x0 <= max) {
    const x1 = new Date(x0);
    x1.setMonth(x1.getMonth() + 1);
    hist.push({
      x0,
      x1,
      label: formatter(x0),
      color: color(new Date(x0.getFullYear(), x0.getMonth(), 15)),
      items: [],
      count: 0,
    });
    x0 = x1;
  }
  return { hist, histGranularity: 'month' };
}

function pushDateHist(hist: IBin<Date>[], v: Date, count = 1) {
  const values = (Array(count) as Date[]).fill(v);
  if (v < hist[0].x1) {
    // eslint-disable-next-line no-param-reassign
    hist[0].count += count;
    (hist[0].items as Date[]).push(...values);
    return;
  }
  const l = hist.length - 1;
  if (v > hist[l].x0) {
    // eslint-disable-next-line no-param-reassign
    hist[l].count += count;
    (hist[l].items as Date[]).push(...values);
    return;
  }
  if (l === 2) {
    // eslint-disable-next-line no-param-reassign
    hist[1].count += count;
    (hist[1].items as Date[]).push(...values);
    return;
  }

  let low = 1;
  let high = l;
  // binary search
  while (low < high) {
    const center = Math.floor((high + low) / 2);
    if (v < hist[center].x1) {
      high = center;
    } else {
      low = center + 1;
    }
  }
  // eslint-disable-next-line no-param-reassign
  hist[low].count += count;
  (hist[low].items as Date[]).push(...values);
}

export type DateFormatter =
  | ((v: Date) => string)
  | {
      locales?: string | string[];
      options?: Intl.DateTimeFormatOptions;
    };

/**
 * helper function to resolve a date formatter
 */
export function resolveDateFormatter(format?: DateFormatter): (v: Date) => string {
  if (typeof format === 'function') {
    return format;
  }
  const f = new Intl.DateTimeFormat(format?.locales, format?.options);
  return f.format.bind(f);
}

function yearFormatter(format?: DateFormatter): (v: Date) => string {
  if (typeof format === 'function') {
    return format;
  }
  const f = new Intl.DateTimeFormat(format?.locales, {
    year: 'numeric',
    ...(format?.options ?? {}),
  });
  return f.format.bind(f);
}

function monthFormatter(format?: DateFormatter): (v: Date) => string {
  if (typeof format === 'function') {
    return format;
  }
  const f = new Intl.DateTimeFormat(format?.locales, {
    year: 'numeric',
    month: 'short',
    ...(format?.options ?? {}),
  });
  return f.format.bind(f);
}

export interface DateStatsOptions {
  /**
   * converts a date to a string
   */
  color?: (v: Date) => string;
  /**
   * how to format the date
   */
  format?: DateFormatter;
  /**
   * defines the minimal date for the histogram
   */
  min?: Date;
  /**
   * defines the maximum date for the histogram
   */
  max?: Date;
  /**
   * defines the histogram granularity to uuse
   */
  histGranularity?: DateHistGranularity;
}

function normalizeDate(min: Date, max: Date) {
  const minN = min.getTime();
  const maxN = max.getTime();
  const range = maxN - minN;
  return {
    min,
    max,
    scale: (v: Date) => (range === 0 ? 0.5 : (v.getTime() - minN) / range),
    invert: (v: number) => (range === 0 ? min : new Date(v * range + minN)),
  };
}

export type DateLike = Date | null | undefined | readonly (Date | null | undefined)[] | Set<Date>;

function createFlat(arr: readonly DateLike[]) {
  let missing = 0;
  const items: (Date | readonly Date[] | Set<Date>)[] = [];
  let flatMissing = 0;
  const flatItems: Date[] = [];
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  let depth = 1;

  const push = (v: Date) => {
    flatItems.push(v);
    const vt = v.getTime();
    if (vt < min) {
      min = vt;
    }
    if (vt > max) {
      max = vt;
    }
  };

  for (const v of arr) {
    if (v == null) {
      missing += 1;
      flatMissing += 1;
      continue;
    }
    if (v instanceof Date) {
      items.push(v);
      push(v);
      continue;
    }
    if (v instanceof Set) {
      items.push(v);
      depth = Math.max(depth, v.size);
      v.forEach((vi) => push(vi));
      continue;
    }
    if (!Array.isArray(v)) {
      continue;
    }
    depth = Math.max(depth, v.length);
    const vClean: Date[] = [];
    for (const vi of v) {
      if (vi == null || !(vi instanceof Date)) {
        flatMissing += 1;
      } else {
        push(vi);
        vClean.push(vi);
      }
    }
    if (vClean.length === v.length) {
      items.push(v as Date[]);
    } else {
      items.push(vClean);
    }
  }
  return {
    missing,
    items,
    flatMissing,
    flatItems,
    depth,
    min,
    max,
  };
}

function computeMedian(items: readonly Date[]): Date {
  if (items.length === 0) {
    return new Date();
  }
  const sorted = items.slice().sort((a, b) => a.valueOf() - b.valueOf());
  if (items.length % 2 === 1) {
    return sorted[(items.length + 1) / 2];
  }
  // average
  const i = items.length / 2;
  const a = sorted[i];
  const b = sorted[i + 1];
  return new Date((a.valueOf() + b.valueOf()) / 2);
}

export function dateStatsGenerator(options: DateStatsOptions = {}): (arr: readonly DateLike[]) => IDateStats {
  const format = resolveDateFormatter(options.format);
  const color = options.color ?? defaultConstantColorScale;

  return (arr): IDateStats => {
    const base = {
      color,
      format,
      count: arr.length,
    };
    const { missing, items, flatMissing, flatItems, min, max, depth } = createFlat(arr);

    const now = new Date();
    const minD = options.min ?? (Number.isFinite(min) ? new Date(min) : now);
    const maxD = options.max ?? (Number.isFinite(max) ? new Date(max) : now);
    const { hist, histGranularity } = computeGranularity(minD, maxD, color, options.format, options.histGranularity);

    for (const v of flatItems) {
      pushDateHist(hist, v);
    }
    const r: IDateStats = {
      missing,
      items,
      flatMissing,
      flatItems,
      depth,
      flatCount: flatMissing + flatItems.length,
      hist,
      histGranularity,
      median: computeMedian(flatItems),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      maxBin: maxHistBin(hist)!,
      ...normalizeDate(minD, maxD),
      ...base,
      [Symbol.toPrimitive]: toDatePrimitive,
    };
    return r;
  };
}
