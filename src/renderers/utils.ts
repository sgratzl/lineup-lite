import { StatsProps } from '../hooks/useStats';
import { UseFiltersColumnProps } from 'react-table';
import { ICommonStats } from '../math/common';

export function toPercent(v: number) {
  return `${Math.round(v * 1000) / 10}%`;
}

function isValueArray<T>(props: any): props is { value: readonly T[] } {
  return Array.isArray((props as { value: readonly T[] }).value);
}

export function isValueStats<S extends ICommonStats>(props: any): props is { value: S } {
  return (
    props != null &&
    props.value != null &&
    typeof props.value.count === 'number' &&
    typeof props.value.missing === 'number'
  );
}

export function extractStats<S extends ICommonStats, T>(
  props: { value: readonly T[] } | StatsProps<any>,
  statsGen: (arr: readonly T[], preFilterValues?: readonly T[]) => S
): S {
  if (isValueArray(props)) {
    return statsGen(props.value);
  }
  if (isValueStats<S>(props)) {
    return props.value;
  }
  if (Array.isArray(props.column.statsValue)) {
    return statsGen(props.column.statsValue);
  }
  if (props.column.statsValue) {
    return props.column.statsValue as S;
  }
  const values = props.flatRows.map((row) => row.values[props.column.id]);
  const preFilteredRows = ((props as unknown) as UseFiltersColumnProps<any>).preFilteredRows;
  const preValues = preFilteredRows ? preFilteredRows.map((row) => row.values[props.column.id]) : undefined;
  return statsGen(values, preValues);
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
