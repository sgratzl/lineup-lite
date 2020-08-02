export interface IBin<T> {
  count: number;
  color: string;
  x0: T;
  x1: T;
}

export interface ICommonStats<T> {
  readonly hist: readonly IBin<T>[];
  readonly maxBin: number;

  readonly missing: number;
  readonly count: number;

  color: (v: T) => string;
  format: (v: T) => string;
}

export interface INumericStats<T> extends ICommonStats<T> {
  readonly min: T;
  readonly max: T;

  scale: (v: T) => number;
  invert: (v: number) => T;
}
