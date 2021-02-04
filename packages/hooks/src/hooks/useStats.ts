/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import {
  HeaderProps,
  Hooks,
  IdType,
  Renderer,
  TableInstance,
  UseFiltersInstanceProps,
  ensurePluginOrder,
  UseGroupByInstanceProps,
  CellProps,
  UseGroupByColumnProps,
  UseFiltersColumnProps,
} from 'react-table';

export type UseStatsOptions = Partial<{
  manualStats: boolean;
  autoResetStats?: boolean;
}>;

export interface UseStatsState<D extends object = {}> {
  Stats: Stats<D>;
}

export type UseStatsColumnOptions<D extends object = {}> = Partial<{
  Summary: Renderer<StatsProps<D>>;
  stats: StatsType;
  // grouper:
}>;

export interface UseStatsInstanceProps {}

export interface UseStatsColumnProps {
  setStats: (updater: ((statsValue: StatsValue) => StatsValue) | StatsValue) => void;
  statsValue: StatsValue;
  preFilterStatsValue?: StatsValue;
}

export type StatsProps<D extends object = {}> = HeaderProps<D> & {
  column: UseStatsColumnProps;
  i18n?: Record<string, string>;
};
export type StatsCellProps<D extends object = {}> = CellProps<D> & {
  column: UseStatsColumnProps;
  i18n?: Record<string, string>;
};
export type StatsValue = any;
export type Stats<D extends object = {}> = Array<{ id: IdType<D>; value: StatsValue }>;

export interface StatsType {
  (values: readonly any[], preFilterStats?: any): any;
}

export type StatsAggregateArray<T> = T[] & { _aggregate?: <V>(gen: (vs: T[], preFilter?: V) => V, stats?: V) => any };

function isStatsAggregateArray(v: any): v is StatsAggregateArray<any> {
  return Array.isArray(v) && typeof (v as StatsAggregateArray<any>)._aggregate === 'function';
}

export function statsAggregate<T>(v: T[]): T[] {
  // combine into an array
  if (Array.isArray(v)) {
    const copy: StatsAggregateArray<T> = v.slice();
    copy._aggregate = (gen, stats) => gen(copy, stats);
    return copy;
  }
  return v;
}

export function statsAggregateArray<T>(v: T[]): T[] {
  // combine into an array
  if (Array.isArray(v)) {
    const copy: StatsAggregateArray<T> = v.slice();
    copy._aggregate = (gen, stats) => {
      // aggregate by column
      const maxLength = copy.reduce((acc, v) => Math.max(acc, Array.isArray(v) ? v.length : 0), 0);
      return Array(maxLength)
        .fill(0)
        .map((_, i) =>
          gen(
            copy.map((d) => (Array.isArray(d) ? d[i] : null)),
            stats
          )
        );
    };
    return copy;
  }
  return v;
}

function DummyComponent() {
  return null;
}

export function useStats<D extends object = {}>(hooks: Hooks<D>) {
  hooks.useInstance.push(useInstance);
}
useStats.pluginName = 'useStats';

function useInstance<D extends object = {}>(instance: TableInstance<D>) {
  ensurePluginOrder(instance.plugins, ['useFilters', 'useGroupBy'], 'useStats');

  const extendedInstance = (instance as unknown) as TableInstance<D> &
    UseFiltersInstanceProps<D> &
    UseGroupByInstanceProps<D>;

  instance.allColumns.forEach((col) => {
    const extended = (col as unknown) as UseStatsColumnProps &
      UseStatsColumnOptions<D> &
      UseGroupByColumnProps<D> &
      UseFiltersColumnProps<D>;

    if (!extended.stats) {
      extended.statsValue = null;
      return;
    }

    const flat = extendedInstance.nonGroupedFlatRows ?? instance.flatRows;
    const values = flat.map((row) => row.values[col.id]);
    const preFilteredFlatRows = extendedInstance.preFilteredFlatRows;

    if (!extended.Summary) {
      extended.Summary = (extended as any).Filter ?? DummyComponent;
    }
    // compute raw stats
    extended.preFilterStatsValue = preFilteredFlatRows
      ? extended.stats(preFilteredFlatRows.map((row) => row.values[col.id]))
      : undefined;
    // compute current stats
    extended.statsValue = extended.stats(values, extended.preFilterStatsValue);

    // compute groups
    const grouped = extendedInstance.onlyGroupedFlatRows ?? [];
    grouped.forEach((group) => {
      const value = group.values[col.id];
      // compute group value for stats
      if (isStatsAggregateArray(value)) {
        group.values[col.id] = value._aggregate!(extended.stats!, extended.statsValue);
      }
    });
  });
}
