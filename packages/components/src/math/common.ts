/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
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
   * in case of nested arrays what is the max nested depth
   */
  readonly depth: number;
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

  /**
   * Converts a Stats object to a string.
   */
  [Symbol.toPrimitive](hint: 'default'): string;
  /**
   * Converts a Stats object to a string.
   */
  [Symbol.toPrimitive](hint: 'string'): string;
  /**
   * Converts a Stats object to a number.
   */
  [Symbol.toPrimitive](hint: 'number'): number;
  /**
   * Converts a Stats object to a string or number.
   *
   * @param hint The strings "number", "string", or "default" to specify what primitive to return.
   *
   * @throws {TypeError} If 'hint' was given something other than "number", "string", or "default".
   * @returns A number if 'hint' was "number", a string if 'hint' was "string" or "default".
   */
  [Symbol.toPrimitive](hint: string): string | number;
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
   * median value in the array
   */
  readonly median: T;
  /**
   * converts the given value to a value between 0 and 1
   */
  scale: (v: T) => number;
  /**
   * invert operation given a number between 0 and 1 convert it back
   */
  invert: (v: number) => T;
}

export function maxHistBin<T>(hist: readonly Readonly<IBin<T>>[]): Readonly<IBin<T>> | null {
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
