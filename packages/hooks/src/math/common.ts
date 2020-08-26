export interface IBin<T> {
  count: number;
  color: string;
  x0: T;
  x1: T;
}

export interface ICommonStats {
  readonly missing: number;
  readonly count: number;
}

export interface IHistStats<T> extends ICommonStats {
  readonly hist: readonly IBin<T>[];
  readonly maxBin: number;

  color: (v: T) => string;
  format: (v: T) => string;
}

export interface INumericStats<T> extends IHistStats<T> {
  readonly min: T;
  readonly max: T;

  scale: (v: T) => number;
  invert: (v: number) => T;
}
