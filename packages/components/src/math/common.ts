/**
 * a bin in the histogram
 */
export interface IBin<T> {
  /**
   * number of items in this bin
   */
  count: number;
  /**
   * color of this bin
   */
  color: string;
  /**
   * label of this bin
   */
  label: string;
  /**
   * start point of this bin
   */
  x0: T;
  /**
   * end point of this bin
   */
  x1: T;

  /**
   * the items in this bin
   */
  items: readonly T[];
}

export interface ICommonStats<T> {
  /**
   * number of missing items in the array
   */
  readonly missing: number;
  /**
   * number of items in the array
   */
  readonly count: number;
  /**
   * the items in this stats
   */
  readonly items: readonly (T | readonly T[] | Set<T>)[];
  /**
   * number of missing items in the array
   */
  readonly flatMissing: number;
  /**
   * number of items in the array
   */
  readonly flatCount: number;
  /**
   * the items in this stats
   */
  readonly flatItems: readonly T[];
}

export interface IHistStats<T> extends ICommonStats<T> {
  /**
   * histogram
   */
  readonly hist: readonly Readonly<IBin<T>>[];
  /**
   * maximal items in a bin
   */
  readonly maxBin: IBin<T>;
  /**
   * converts a given (normalized) value to a color
   */
  color: (v: T) => string;
  /**
   * converts the given value to a label
   */
  format: (v: T) => string;
}

export function toHistString<T>(hist: readonly Readonly<IBin<T>>[]): string {
  return `(${hist.map((d) => `${d.label}=${d.count}`).join(', ')})`;
}

export interface INumericStats<T> extends IHistStats<T> {
  /**
   * minimal value in the array
   */
  readonly min: T;
  /**
   * maximum value in the array
   */
  readonly max: T;
  /**
   * converts the given value to a value between 0 and 1
   */
  scale: (v: T) => number;
  /**
   * invert operation given a number between 0 and 1 convert it back
   */
  invert: (v: number) => T;
}

export function maxHistBin<T>(hist: readonly Readonly<IBin<T>>[]) {
  if (hist.length === 0) {
    return null;
  }
  let max = hist[0];
  for (const bin of hist) {
    if (bin.count > max.count) {
      max = bin;
    }
  }
  return max;
}
