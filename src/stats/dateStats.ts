import { defaultConstantColorScale } from '../renderers/defaults';
import { IBin } from './numberStats';
import { INumericStats } from './common';

export declare type DateHistGranularity = 'year' | 'month' | 'day' | 'decade';

export interface IDateStats extends INumericStats<Date> {
  histGranularity: DateHistGranularity;
}

/**
 * guesses the histogram granularity to use based on min and max date
 */
function computeGranularity(
  min: Date,
  max: Date,
  color: (v: Date) => string
): { histGranularity: DateHistGranularity; hist: IBin<Date>[] } {
  const hist: IBin<Date>[] = [];

  if (max.getFullYear() - min.getFullYear() >= 30) {
    // more than 3 decades
    const minYear = Math.floor(min.getFullYear() / 10) * 10;
    const maxYear = max.getFullYear();
    for (let i = minYear; i <= maxYear; i += 10) {
      hist.push({
        x0: new Date(i, 0, 1),
        x1: new Date(i + 10, 0, 1),
        color: color(new Date(i + 5, 0, 1)),
        count: 0,
      });
    }
    return { hist, histGranularity: 'decade' };
  }

  if (max.getFullYear() - min.getFullYear() >= 2) {
    // more than two years difference
    const minYear = min.getFullYear();
    const maxYear = max.getFullYear();
    for (let i = minYear; i <= maxYear; ++i) {
      hist.push({
        x0: new Date(i, 0, 1),
        x1: new Date(i + 1, 0, 1),
        color: color(new Date(i, 6, 1)),
        count: 0,
      });
    }
    return { hist, histGranularity: 'year' };
  }

  if (max.getTime() - min.getTime() <= 1000 * 60 * 60 * 24 * 31) {
    // less than a month use day
    let x0 = new Date(min.getFullYear(), min.getMonth(), min.getDate());
    while (x0 <= max) {
      const x1 = new Date(x0);
      x1.setDate(x1.getDate() + 1);
      hist.push({
        x0,
        x1,
        color: color(new Date(x0.getFullYear(), x0.getMonth(), x0.getDate(), 12)),
        count: 0,
      });
      x0 = x1;
    }
    return { hist, histGranularity: 'day' };
  }

  // by month
  let x0 = new Date(min.getFullYear(), min.getMonth(), 1);
  while (x0 <= max) {
    const x1 = new Date(x0);
    x1.setMonth(x1.getMonth() + 1);
    hist.push({
      x0,
      x1,
      color: color(new Date(x0.getFullYear(), x0.getMonth(), 15)),
      count: 0,
    });
    x0 = x1;
  }
  return { hist, histGranularity: 'month' };
}

function pushDateHist(hist: IBin<Date>[], v: Date, count: number = 1) {
  if (v < hist[0].x1) {
    hist[0].count += count;
    return;
  }
  const l = hist.length - 1;
  if (v > hist[l].x0) {
    hist[l].count += count;
    return;
  }
  if (l === 2) {
    hist[1].count += count;
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
  hist[low].count += count;
}

export interface DateStatsOptions {
  color?: (v: Date) => string;
  locales?: string | string[];
  format?: Intl.DateTimeFormatOptions;
  min?: Date;
  max?: Date;
}

export function dateStats(options: DateStatsOptions = {}) {
  const format = new Intl.DateTimeFormat(options.locales, options.format);
  const color = options.color ?? defaultConstantColorScale;

  return (arr: readonly (Date | null)[]): IDateStats => {
    const simpleStats = arr.reduce(
      (acc, v) => {
        if (!v) {
          return acc;
        }
        const t = v.getTime();
        acc.valid++;
        acc.min = Math.min(acc.min, t);
        acc.max = Math.max(acc.max, t);
        return acc;
      },
      { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY, valid: 0 }
    );

    if (simpleStats.valid === 0) {
      return {
        hist: [],
        histGranularity: 'year',
        missing: arr.length,
        count: arr.length,
        min: options.min ?? new Date(),
        max: options.max ?? new Date(),
        maxBin: 0,
        color,
        format: format.format.bind(format),
      };
    }

    const min = options.min ?? new Date(simpleStats.min);
    const max = options.max ?? new Date(simpleStats.max);
    const { hist, histGranularity } = computeGranularity(min, max, color);

    let missing = 0;
    for (const d of arr) {
      if (!d) {
        missing++;
        continue;
      }
      pushDateHist(hist, d);
    }
    return {
      hist,
      histGranularity,
      min,
      max,
      missing,
      count: arr.length,
      maxBin: hist.reduce((acc, b) => Math.max(acc, b.count), 0),
      color,
      format: format.format.bind(format),
    };
  };
}
