import { StatsProps, StatsCellProps } from '../hooks';
import { UseFiltersColumnProps, UseGroupByInstanceProps, Cell, CellProps, UseGroupByCellProps } from 'react-table';
import { ICommonStats, IHistStats } from '@lineup-lite/components';
import { createContext } from 'react';

export const optionContext = createContext<{ [key: string]: any }>({});
export const statsGeneratorContext = createContext<null | any>(null);

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
  const cellProps = (props as unknown) as CellProps<any, any>;
  const cell = cellProps.cell as Cell<any, any> & UseGroupByCellProps<any>;

  if (cell) {
    return {
      s: isValueArray(props) ? statsGen(props.value, s) : (cellProps.value as S),
      preFilter,
      cell,
    };
  }
  return {
    s,
    preFilter,
    cell,
    isAggregated: false,
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
  return stats.reduce((acc, v) => (v != null && typeof v.maxBin === 'number' ? Math.max(acc, v.maxBin) : acc), 0);
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
