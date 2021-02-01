/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { StatsProps, StatsCellProps } from '../hooks';
import type { UseFiltersColumnProps, UseGroupByInstanceProps, Cell, CellProps, UseGroupByCellProps } from 'react-table';
import { ICommonStats, IHistStats, defaultCategoricalColorScale } from '@lineup-lite/components';
import { createContext, Context, useCallback, useRef } from 'react';

export const EMPTY_ARR = [];
export const EMPTY_OBJ = {};

export const optionContext: Context<{ [key: string]: any }> = createContext<{ [key: string]: any }>({});
export const statsGeneratorContext: Context<null | any> = createContext<null | any>(null);

export type StatsPropsLike<T> =
  | ({ value: readonly T[]; i18n?: Record<string, string> } & StatsCellProps<any>)
  | StatsProps<any>;

function isValueArray<T>(props: any): props is { value: readonly T[] } {
  return Array.isArray((props as { value: readonly T[] }).value);
}

export function deriveStats<S extends ICommonStats<T>, T>(
  props: StatsPropsLike<T>,
  statsGen: (arr: readonly T[], preFilterValues?: S) => S
) {
  if (props.column.statsValue) {
    return {
      s: props.column.statsValue as S,
      preFilter: props.column.preFilterStatsValue as S,
    };
  }
  const flat = ((props as unknown) as UseGroupByInstanceProps<any>).nonGroupedFlatRows ?? props.flatRows;
  const values = flat.map((row) => row.values[props.column.id]);
  const preFilteredRows = ((props as unknown) as UseFiltersColumnProps<any>).preFilteredRows;
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
) {
  const { s, preFilter } = deriveStats(props, statsGen);
  const cellProps = (props as unknown) as CellProps<any, any>;
  const cell = cellProps.cell as Cell<any, any> & UseGroupByCellProps<any>;

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

export function groupMaxBin<P extends StatsPropsLike<any>>(
  options: { maxBin?: number },
  cell: { isAggregated: boolean },
  props: P
) {
  if (options.maxBin != null || !cell.isAggregated) {
    return options.maxBin;
  }
  const groups = ((props as unknown) as UseGroupByInstanceProps<any>).onlyGroupedFlatRows ?? [];
  const stats = groups.map((group) => group.values[props.column.id]) as IHistStats<any>[];
  return stats.reduce((acc, v) => (v != null && v.maxBin != null ? Math.max(acc, v.maxBin.count) : acc), 1);
}

/**
 * helper function to resolve the first of multiple candidates
 * @param directValue first candidate
 * @param globalValue second candidate
 * @param defaultValue factory function for generating a default value
 */
export function resolve<T>(directValue: T | undefined, globalValue: T | undefined, defaultValue: () => T) {
  if (directValue != null) {
    return directValue;
  }
  if (globalValue != null) {
    return globalValue;
  }
  return defaultValue();
}

export function isFilterAble<D extends object>(props: any): props is { column: UseFiltersColumnProps<D> } {
  return typeof (props.column as UseFiltersColumnProps<D>).setFilter === 'function';
}

export function identity(v: string) {
  return v;
}

export function generateIdentity() {
  return identity;
}

export function generateColor() {
  return defaultCategoricalColorScale();
}

// own implementation to avoid regenerator runtime
export function useAsyncDebounce<F extends (...args: any[]) => void>(f: F, timeout = 0): F {
  const debounceRef = useRef(-1);

  const b = useCallback(
    (...args: any[]) => {
      if (debounceRef.current >= 0) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        debounceRef.current = -1;
        f(...args);
      }, timeout);
    },
    [f, timeout]
  );
  return b as F;
}
