/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import {
  HeaderProps,
  Hooks,
  Renderer,
  TableInstance,
  UseFiltersInstanceProps,
  ensurePluginOrder,
  UseGroupByInstanceProps,
  CellProps,
  UseGroupByColumnProps,
  UseFiltersColumnProps,
} from 'react-table';
import type { AnyObject, UnknownObject } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StatsValue = any;

export interface StatsType {
  (values: readonly unknown[], preFilterStats?: unknown): unknown;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseStatsOptions {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseStatsState {}

export interface UseStatsColumnOptions<D extends AnyObject = UnknownObject> {
  Summary?: Renderer<StatsProps<D>>;
  stats?: StatsType;
  // grouper:
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseStatsInstanceProps {}

export interface UseStatsColumnProps {
  setStats: (updater: ((statsValue: StatsValue) => StatsValue) | StatsValue) => void;
  statsValue: StatsValue;
  preFilterStatsValue?: StatsValue;
}

export type StatsProps<D extends AnyObject = UnknownObject> = HeaderProps<D> & {
  column: UseStatsColumnProps;
  i18n?: Record<string, string>;
};
export type StatsCellProps<D extends AnyObject = UnknownObject> = CellProps<D> & {
  column: UseStatsColumnProps;
  i18n?: Record<string, string>;
};

export type StatsAggregateArray<T> = T[] & {
  _aggregate?: <V>(gen: (vs: T[], preFilter?: V) => V, stats?: V) => unknown;
};

function isStatsAggregateArray(v: unknown): v is StatsAggregateArray<unknown> {
  // eslint-disable-next-line no-underscore-dangle
  return Array.isArray(v) && typeof (v as StatsAggregateArray<unknown>)._aggregate === 'function';
}

export function statsAggregate<T>(v: T[]): T[] {
  // combine into an array
  if (Array.isArray(v)) {
    const copy: StatsAggregateArray<T> = v.slice();
    // eslint-disable-next-line no-underscore-dangle
    copy._aggregate = (gen, stats) => gen(copy, stats);
    return copy;
  }
  return v;
}

export function statsAggregateArray<T>(v: T[]): T[] {
  // combine into an array
  if (Array.isArray(v)) {
    const copy: StatsAggregateArray<T> = v.slice();
    // eslint-disable-next-line no-underscore-dangle
    copy._aggregate = (gen, stats) => {
      // aggregate by column
      const maxLength = copy.reduce((acc, vi) => Math.max(acc, Array.isArray(vi) ? vi.length : 0), 0);
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

export function useStats<D extends AnyObject = UnknownObject>(hooks: Hooks<D>): void {
  hooks.useInstance.push(useInstance);
}
useStats.pluginName = 'useStats';

function useInstance<D extends AnyObject = UnknownObject>(instance: TableInstance<D>) {
  ensurePluginOrder(instance.plugins, ['useFilters', 'useGroupBy'], 'useStats');

  const extendedInstance = instance as unknown as TableInstance<D> &
    UseFiltersInstanceProps<D> &
    UseGroupByInstanceProps<D>;

  instance.allColumns.forEach((col) => {
    const extended = col as unknown as UseStatsColumnProps &
      UseStatsColumnOptions<D> &
      UseGroupByColumnProps<D> &
      UseFiltersColumnProps<D>;

    if (!extended.stats) {
      extended.statsValue = null;
      return;
    }

    const flat = extendedInstance.nonGroupedFlatRows ?? instance.flatRows;
    const values = flat.map((row) => row.values[col.id]);
    const { preFilteredFlatRows } = extendedInstance;

    if (!extended.Summary) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        // eslint-disable-next-line no-param-reassign, no-underscore-dangle, @typescript-eslint/no-non-null-assertion
        group.values[col.id] = value._aggregate!(extended.stats!, extended.statsValue);
      }
    });
  });
}
