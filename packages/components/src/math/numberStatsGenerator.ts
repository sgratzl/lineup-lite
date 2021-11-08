/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import boxplot, { BoxplotStatsOptions, IBoxPlot } from '@sgratzl/boxplots';
import { defaultColorScale, defaultDivergingColorScale } from './defaults';
import { INumericStats, IBin, toHistString, maxHistBin } from './common';
import { normalize, deNormalize } from './scale';

/**
 * computes the optimal number of bins for a given array length
 * @param length
 */
export function getNumberOfBins(length: number): number {
  if (length === 0) {
    return 1;
  }
  // as by default used in d3 the Sturges' formula
  return Math.ceil(Math.log(length) / Math.LN2) + 1;
}

/**
 * number statistics object
 */
export interface INumberStats extends Omit<IBoxPlot, 'items'>, INumericStats<number> {
  /**
   * optional center for diverging
   */
  readonly center?: number;
}

export function isNumberStats(obj: unknown): obj is INumberStats {
  return obj != null && typeof (obj as INumberStats).min === 'number' && typeof (obj as INumberStats).max === 'number';
}

export type NumberFormatter =
  | ((v: number) => string)
  | {
      locales?: string | string[];
      options?: Intl.NumberFormatOptions;
    };

function toNumberString(this: INumberStats) {
  const f = (v: number) => this.format(v);
  return `NumberStats(count=${this.count}, min=${f(this.min)}, median=${f(this.median)}, max=${f(
    this.max
  )}, hist=${toHistString(this.hist)})`;
}

function toNumberPrimitive(this: INumberStats, hint: 'string' | 'default'): string;
function toNumberPrimitive(this: INumberStats, hint: 'number'): number;
function toNumberPrimitive(this: INumberStats, hint: 'number' | 'string' | 'default') {
  if (hint === 'string' || hint === 'default') {
    return toNumberString.call(this);
  }
  if (hint === 'number') {
    return this.median;
  }
  throw new TypeError('invalid hint');
}

/**
 * helper function to resolve the number formatter
 */
export function resolveNumberFormatter(format?: NumberFormatter): (v: number) => string {
  if (typeof format === 'function') {
    return format;
  }
  const f = new Intl.NumberFormat(format ? format.locales : undefined, format ? format.options : undefined);
  return (v) => (v == null ? '' : f.format(v));
}

export interface NumberStatsOptions extends BoxplotStatsOptions {
  /**
   * defines the minimum, otherwise derives it
   */
  min?: number;
  /**
   * defines the maximum, otherwise derives it
   */
  max?: number;
  /**
   * optional center for diverging histograms
   */
  center?: number;
  /**
   * fixes the number of bins
   */
  numberOfBins?: number;

  /**
   * color function to convert a number between 0...1 to a color
   */
  color?: (v: number) => string;
  format?: NumberFormatter;
}

function createHist(
  b: IBoxPlot,
  min: number,
  max: number,
  color: (v: number) => string,
  format: (v: number) => string,
  numberOfBins?: number
) {
  const bins = numberOfBins ?? getNumberOfBins(b.count);
  const binWidth = (max - min) / bins;
  const scale = normalize(min, max);
  const hist: IBin<number>[] = Array(bins)
    .fill(0)
    .map((_, i) => {
      const x0 = min + binWidth * i;
      return {
        count: 0,
        items: [],
        x0,
        x1: x0 + binWidth,
        label: `${format(x0)} - ${format(x0 + binWidth)}`,
        color: color(scale(x0 + binWidth / 2)),
      };
    });
  if (hist.length === 0) {
    return hist;
  }
  hist[hist.length - 1].x1 = max;

  // sorted
  for (let i = 0; i < b.items.length; i += 1) {
    const v = +b.items[i];
    const bin = hist.find((d) => v < d.x1) || hist[hist.length - 1];
    bin.count += 1;
    (bin.items as number[]).push(v);
  }
  return hist;
}

export type NumberLike =
  | number
  | null
  | undefined
  | readonly (number | null | undefined)[]
  | Set<number>
  | Float32Array
  | Float64Array;

function createFlat(arr: readonly NumberLike[] | Float32Array | Float64Array) {
  let missing = 0;
  const items: (number | readonly number[] | Set<number>)[] = [];
  let flatMissing = 0;
  const flatItems: number[] = [];
  let depth = 1;

  for (const v of arr) {
    if (v == null) {
      missing += 1;
      flatMissing += 1;
      continue;
    }
    if (typeof v === 'number' || (!Array.isArray(v) && !(v instanceof Set))) {
      items.push(+v);
      flatItems.push(+v);
      continue;
    }
    if (v instanceof Set) {
      items.push(v);
      v.forEach((vi) => flatItems.push(+vi));
      depth = Math.max(depth, v.size);
      continue;
    }
    if (!Array.isArray(v)) {
      continue;
    }
    depth = Math.max(depth, v.length);
    const vClean: number[] = [];
    for (const vi of v) {
      if (vi == null) {
        flatMissing += 1;
      } else {
        flatItems.push(+vi);
        vClean.push(+vi);
      }
    }
    if (vClean.length === v.length) {
      items.push(v as number[]);
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
  };
}

export function numberStatsGenerator(
  options: NumberStatsOptions = {}
): (arr: readonly NumberLike[] | Float32Array | Float64Array) => INumberStats {
  const format = resolveNumberFormatter(options.format);

  return (arr): INumberStats => {
    const { missing, items, flatMissing, flatItems, depth } = createFlat(arr);
    const b = boxplot(flatItems, options);
    const min = options.min ?? b.min;
    const max = options.max ?? b.max;
    // guess diverging or normal
    const color = options.color ?? (min < 0 && max > 0 ? defaultDivergingColorScale : defaultColorScale);
    const hist = createHist(b, min, max, color, format, options.numberOfBins);
    const r: INumberStats = Object.assign(b, {
      min,
      max,
      center: options.center,
      hist,
      missing,
      items,
      flatMissing,
      flatItems,
      depth,
      flatCount: flatMissing + flatItems.length,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      maxBin: maxHistBin(hist)!,
      scale: normalize(min, max),
      invert: deNormalize(min, max),
      format,
      color,
      [Symbol.toPrimitive]: toNumberPrimitive,
    });
    return r;
  };
}

export function simpleStats(values: readonly number[]): { min: number; max: number; count: number; missing: number } {
  let min = 0;
  let max = 1;
  let count = 0;
  let missing = 0;
  for (const v of values) {
    if (v == null || Number.isNaN(v)) {
      missing += 1;
      continue;
    }
    count += 1;
    if (count === 1 || v < min) {
      min = v;
    }
    if (count === 1 || v > max) {
      max = v;
    }
  }
  return { min, max, count, missing };
}
