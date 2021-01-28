import boxplot, { BoxplotStatsOptions, IBoxPlot } from '@sgratzl/boxplots';
import { defaultColorScale } from './defaults';
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
export interface INumberStats extends IBoxPlot, INumericStats<number> {
  items: readonly number[];
}

export function isNumberStats(obj: any): obj is INumberStats {
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
/**
 * helper function to resolve the number formatter
 */
export function resolveNumberFormatter(format?: NumberFormatter): (v: number) => string {
  if (typeof format === 'function') {
    return format;
  }
  const f = new Intl.NumberFormat(format ? format.locales : undefined, format ? format.options : undefined);
  return f.format.bind(f);
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
  for (let i = 0; i < b.items.length; i++) {
    const v = b.items[i];
    const bin = hist.find((d) => v < d.x1) || hist[hist.length - 1];
    bin.count++;
    (bin.items as number[]).push(v);
  }
  return hist;
}

export function numberStatsGenerator(
  options: NumberStatsOptions = {}
): (arr: readonly number[] | Float32Array | Float64Array) => INumberStats {
  const color = options.color ?? defaultColorScale;
  const format = resolveNumberFormatter(options.format);

  return (arr: readonly number[] | Float32Array | Float64Array): INumberStats => {
    const b = boxplot(arr, options);
    const min = options.min ?? b.min;
    const max = options.max ?? b.max;
    const hist = createHist(b, min, max, color, format, options.numberOfBins);
    const r: INumberStats = Object.assign(b, {
      min,
      max,
      hist,
      items: Array.from(b.items),
      maxBin: maxHistBin(hist)!,
      scale: normalize(min, max),
      invert: deNormalize(min, max),
      format,
      color,
    });
    r.toString = toNumberString;
    return r;
  };
}
