import boxplot, { BoxplotStatsOptions, IBoxPlot } from '@sgratzl/boxplots';
import { defaultColorScale } from './defaults';
import { INumericStats, IBin } from './common';
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
  const bins = numberOfBins ?? getNumberOfBins(b.count);
  const binWidth = (max - min) / bins;
  const scale = normalize(min, max);
  const hist: IBin<number>[] = Array(bins)
    .fill(0)
    .map((_, i) => {
      const x0 = min + binWidth * i;
      return {
        count: 0,
        x0,
        x1: x0 + binWidth,
        color: color(scale(x0 + binWidth / 2)),
      };
    });
  if (hist.length === 0) {
    return hist;
  }
  hist[hist.length - 1].x1 = max;

  // sorted
  for (let i = 0; i < b.items.length; i++) {
    const v = b.items[i];
    const bin = hist.find((d) => v < d.x1) || hist[hist.length - 1];
    bin.count++;
  }
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
