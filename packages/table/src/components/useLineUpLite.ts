/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import {
  columnSpecificGroupByFn,
  LineUpLiteColumn,
  useRowExpandColumn,
  UseRowExpandColumnTableOptions,
  useRowRankColumn,
  UseRowRankColumnTableOptions,
  useRowSelectColumn,
  UseSelectColumnTableOptions,
  useStats,
} from '@lineup-lite/hooks';
import { useEffect } from 'react';
import {
  PluginHook,
  TableInstance,
  TableOptions,
  useBlockLayout,
  useExpanded,
  UseExpandedOptions,
  useFilters,
  UseFiltersInstanceProps,
  UseFiltersOptions,
  useGroupBy as useGroupByImpl,
  UseGroupByOptions,
  useResizeColumns,
  useRowSelect as useRowSelectImpl,
  UseRowSelectOptions,
  useSortBy,
  UseSortByOptions,
  useTable,
} from 'react-table';
import { useLineUpLiteStateContext } from './contexts';

export { useRowRankColumn as featureRowRank } from '@lineup-lite/hooks';
export {
  useFilters as featureFilterColumns,
  useResizeColumns as featureResizeColumns,
  useSortBy as featureSortBy,
} from 'react-table';

export type UseLineUpLiteTableOptions<D extends object> = TableOptions<D> &
  UseFiltersOptions<D> &
  UseExpandedOptions<D> &
  UseGroupByOptions<D> &
  UseRowSelectOptions<D> &
  UseSortByOptions<D> &
  UseRowExpandColumnTableOptions &
  UseSelectColumnTableOptions &
  UseRowRankColumnTableOptions;

export interface UseLineUpLiteOptions<D extends object> extends UseLineUpLiteTableOptions<D> {
  defaultColumn?: Partial<LineUpLiteColumn<D>>;
  columns: LineUpLiteColumn<D>[];
  features: readonly (PluginHook<D> | PluginHook<D>[])[];

  onStateChange?: (state: any) => void;
}

export function featureRowSelect<D extends object>(): PluginHook<D>[] {
  return [useRowSelectImpl, useRowSelectColumn];
}

export function featureSortAndGroupBy<D extends object>(): PluginHook<D>[] {
  return [useGroupByImpl, useSortBy, useExpanded, useRowExpandColumn];
}

export function featureDefault<D extends object>(): PluginHook<D>[] {
  return [useResizeColumns, useFilters, ...featureSortAndGroupBy<D>(), ...featureRowSelect<D>(), useRowRankColumn];
}

function sortByPriority<D extends object>(a: [PluginHook<D>, number], b: [PluginHook<D>, number]) {
  const specialOrders = ['useRowSelect', 'useRowRankColumn', 'useRowExpandColumn'];
  // ensure useRowExpandColumn is after useRowSelectColumn
  const isASpecial = specialOrders.indexOf(a[0].pluginName!);
  const isBSpecial = specialOrders.indexOf(b[0].pluginName!);
  if (isASpecial >= 0) {
    return isBSpecial >= 0 ? isASpecial - isBSpecial : 1;
  }
  if (isBSpecial >= 0) {
    return -1;
  }
  return a[1] - b[1];
}

export function useLineUpLite<D extends object>(
  { features, ...props }: UseLineUpLiteOptions<D>,
  ...extraPlugins: PluginHook<D>[]
) {
  const tableProps: UseLineUpLiteTableOptions<D> & UseRowExpandColumnTableOptions = {
    groupByFn: columnSpecificGroupByFn,
    ...props,
  };
  const allPlugins = [...features.flat(), useStats, useBlockLayout, ...extraPlugins]
    .map((d, i) => [d, i] as [PluginHook<D>, number])
    .sort(sortByPriority)
    .map((r) => r[0]);
  const instance = useTable<D>(tableProps, ...allPlugins) as TableInstance<D> & UseFiltersInstanceProps<D>;

  const { onStateChange } = props;
  const { state } = instance;

  useEffect(() => {
    if (onStateChange) {
      onStateChange(state);
    }
  }, [onStateChange, state]);

  // update state context
  const stateContext = useLineUpLiteStateContext<D>();
  useEffect(() => {
    if (stateContext) {
      stateContext.setState(state);
    }
  }, [stateContext, state]);
  useEffect(() => {
    if (stateContext) {
      stateContext.setInstance(instance);
    }
  }, [stateContext, instance]);

  return instance;
}
