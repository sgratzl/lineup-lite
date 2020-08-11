import boxplot, { BoxplotStatsOptions, IBoxPlot } from '@sgratzl/boxplots';
import { defaultColorScale } from '../renderers/defaults';
import { INumericStats } from './common';
import { normalize, deNormalize } from './scale';

/**
 * computes the optimal number of bins for a given array length
 * @param {number} length
 * @returns {number}
 */
export function getNumberOfBins(length: number) {
  if (length === 0) {
    return 1;
  }
  // as by default used in d3 the Sturges' formula
  return Math.ceil(Math.log(length) / Math.LN2) + 1;
}

export interface IBin<T> {
  count: number;
  color: string;
  x0: T;
  x1: T;
}

export interface INumberStats extends IBoxPlot, INumericStats<number> {}

export type NumberFormatter =
  | ((v: number) => string)
  | {
      locales?: string | string[];
      options?: Intl.NumberFormatOptions;
    };

export function resolveNumberFormatter(format?: NumberFormatter): (v: number) => string {
  if (typeof format === 'function') {
    return format;
  }
  const f = new Intl.NumberFormat(format ? format.locales : undefined, format ? format.options : undefined);
  return f.format.bind(f);
}

export interface NumberStatsOptions extends BoxplotStatsOptions {
  min?: number;
  max?: number;
  numberOfBins?: number;

  color?: (v: number) => string;
  format?: NumberFormatter;
}

function createHist(b: IBoxPlot, min: number, max: number, color: (v: number) => string, numberOfBins?: number) {
  const hist: IBin<number>[] = [];
  const bins = numberOfBins ?? getNumberOfBins(b.count);
  const binWidth = (max - min) / bins;
  const scale = normalize(min, max);
  let bin: IBin<number> = {
    count: 0,
    x0: min,
    x1: min + binWidth,
    color: color(scale(b.min + binWidth / 2)),
  };
  hist.push(bin);
  // sorted
  for (let i = 0; i < b.items.length; i++) {
    const v = b.items[i];
    if (v < bin.x1 || hist.length >= bins) {
      bin.count++;
      continue;
    }
    // need a new bin
    bin = {
      count: 0,
      x0: bin.x1,
      x1: bin.x1 + binWidth,
      color: color(scale(bin.x1 + binWidth / 2)),
    };
    hist.push(bin);
  }
  // ensure last x1 is the max
  bin.x1 = max;
  return hist;
}

export function numberStatsGenerator(options: NumberStatsOptions = {}) {
  const color = options.color ?? defaultColorScale;
  const format = resolveNumberFormatter(options.format);

  return (arr: readonly number[] | Float32Array | Float64Array): INumberStats => {
    const b = boxplot(arr, options);
    const min = options.min ?? b.min;
    const max = options.max ?? b.max;
    const hist = createHist(b, min, max, color, options.numberOfBins);
    return Object.assign(b, {
      min,
      max,
      hist,
      maxBin: hist.reduce((acc, b) => Math.max(acc, b.count), 0),
      scale: normalize(min, max),
      invert: deNormalize(min, max),
      format,
      color,
    });
  };
}
