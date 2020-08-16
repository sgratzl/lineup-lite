import { StatsProps, StatsCellProps } from '../hooks/useStats';
import { UseFiltersColumnProps, UseGroupByInstanceProps } from 'react-table';
import { ICommonStats } from '../math/common';

export function toPercent(v: number) {
  return `${Math.round(v * 1000) / 10}%`;
}

export type StatsPropsLike<T> = ({ value: readonly T[] } & StatsCellProps<any>) | StatsProps<any>;

function isValueArray<T>(props: any): props is { value: readonly T[] } {
  return Array.isArray((props as { value: readonly T[] }).value);
}

function deriveStats<S extends ICommonStats, T>(
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

export function extractStats<S extends ICommonStats, T>(
  props: StatsPropsLike<T>,
  statsGen: (arr: readonly T[], preFilterValues?: S) => S
) {
  const { s, preFilter } = deriveStats(props, statsGen);
  if (isValueArray(props)) {
    // cell case
    return {
      s: statsGen(props.value, s),
      preFilter,
      isCell: true,
    };
  }
  return { s, preFilter, isCell: false };
}

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

export function cslx(...args: (boolean | string | undefined | null)[]) {
  return args.filter(Boolean).join(' ');
}
