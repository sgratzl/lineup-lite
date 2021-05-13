/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { UseFiltersColumnProps, UseGroupByInstanceProps, Cell, CellProps, UseGroupByCellProps } from 'react-table';
import { ICommonStats, IHistStats, defaultCategoricalColorScale } from '@lineup-lite/components';
import { createContext, Context, useCallback, useRef } from 'react';
import type { StatsProps, StatsCellProps } from '../hooks';
import type { AnyObject, UnknownObject } from '../interfaces';

export const EMPTY_ARR = [];
export const EMPTY_OBJ = {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const optionContext: Context<any> = createContext<UnknownObject>({});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const statsGeneratorContext: Context<null | any> = createContext<null | any>(null);

export type StatsPropsLike<T> =
  | ({ value: readonly T[]; i18n?: Record<string, string> } & StatsCellProps<UnknownObject>)
  | StatsProps<UnknownObject>;

function isValueArray<T>(props: unknown): props is { value: readonly T[] } {
  return Array.isArray((props as { value: readonly T[] }).value);
}

export function deriveStats<S extends ICommonStats<T>, T>(
  props: StatsPropsLike<T>,
  statsGen: (arr: readonly T[], preFilterValues?: S) => S
): { s: S; preFilter?: S } {
  if (props.column.statsValue) {
    return {
      s: props.column.statsValue as S,
      preFilter: props.column.preFilterStatsValue as S,
    };
  }
  const flat = (props as unknown as UseGroupByInstanceProps<UnknownObject>).nonGroupedFlatRows ?? props.flatRows;
  const values = flat.map((row) => row.values[props.column.id]);
  const { preFilteredRows } = props as unknown as UseFiltersColumnProps<UnknownObject>;
  const preFilterStats = preFilteredRows
    ? statsGen(preFilteredRows.map((row) => row.values[props.column.id]))
    : undefined;
  return {
    s: statsGen(values, preFilterStats),
    preFilter: preFilterStats,
  };
}

export function extractStats<S extends ICommonStats<T>, T>(
  props: StatsPropsLike<T>,
  statsGen: (arr: readonly T[], preFilterValues?: S) => S,
  expectArray = false
): {
  s: S;
  preFilter: S | undefined;
  cell: Cell<UnknownObject, unknown>;
  base?: S | null;
  isAggregated?: boolean;
} {
  const { s, preFilter } = deriveStats(props, statsGen);
  const cellProps = props as unknown as CellProps<UnknownObject, unknown>;
  const cell = cellProps.cell as Cell<UnknownObject, unknown> & UseGroupByCellProps<UnknownObject>;

  if (cell) {
    return {
      s: isValueArray(props) && !expectArray ? statsGen(props.value, s) : (cellProps.value as S),
      preFilter,
      cell,
      base: s,
    };
  }
  return {
    s,
    preFilter,
    cell,
    isAggregated: false,
    base: null as null | S,
  };
}

export function groupMaxBin<P extends StatsPropsLike<UnknownObject>>(
  options: { maxBin?: number },
  cell: { isAggregated?: boolean },
  props: P
): number {
  if (options.maxBin != null || !cell.isAggregated) {
    return options.maxBin ?? 0;
  }
  const groups = (props as unknown as UseGroupByInstanceProps<UnknownObject>).onlyGroupedFlatRows ?? [];
  const stats = groups.map((group) => group.values[props.column.id]) as IHistStats<unknown>[];
  return stats.reduce((acc, v) => (v != null && v.maxBin != null ? Math.max(acc, v.maxBin.count) : acc), 1);
}

/**
 * helper function to resolve the first of multiple candidates
 * @param directValue first candidate
 * @param globalValue second candidate
 * @param defaultValue factory function for generating a default value
 */
export function resolve<T>(directValue: T | undefined, globalValue: T | undefined, defaultValue: () => T): T {
  if (directValue != null) {
    return directValue;
  }
  if (globalValue != null) {
    return globalValue;
  }
  return defaultValue();
}

export function isFilterAble<D extends AnyObject = UnknownObject>(
  props: unknown
): props is { column: UseFiltersColumnProps<D> } {
  if (!props || (props as UnknownObject).column == null) {
    return false;
  }
  return typeof ((props as UnknownObject).column as UseFiltersColumnProps<D>).setFilter === 'function';
}

export function identity<T>(v: T): T {
  return v;
}

export function generateIdentity<T>(): (v: T) => T {
  return identity;
}

export function generateColor(): (v: string) => string {
  return defaultCategoricalColorScale();
}

// own implementation to avoid regenerator runtime
export function useAsyncDebounce<T>(f: (v: T) => void, timeout = 0): (v: T) => void {
  const debounceRef = useRef(-1);

  return useCallback(
    (arg: T) => {
      if (debounceRef.current >= 0) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        debounceRef.current = -1;
        f(arg);
      }, timeout);
    },
    [f, timeout]
  );
}

/**
 * checks whether the given value is missing
 * @param v value to check
 */
export function isMissing(v: null | undefined | unknown): boolean {
  return (
    v == null ||
    (typeof v === 'number' && Number.isNaN(v)) ||
    (typeof v === 'string' && ['NaN', 'N/A', 'NA'].includes(v))
  );
}

export function missingClass(v: null | undefined | unknown): string | undefined {
  return isMissing(v) ? 'lt-missing' : undefined;
}
