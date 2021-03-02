/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import {
  columnSpecificGroupByFn,
  LineUpLiteColumn,
  UnknownObject,
  useRowExpandColumn,
  UseRowExpandColumnTableOptions,
  useRowRankColumn,
  UseRowRankColumnTableOptions,
  useRowSelectColumn,
  UseSelectColumnTableOptions,
  useStats,
} from '@lineup-lite/hooks';
import {
  PluginHook,
  TableInstance,
  TableOptions,
  TableState,
  useBlockLayout,
  useExpanded,
  UseExpandedInstanceProps,
  UseExpandedOptions,
  UseExpandedState,
  useFilters,
  UseFiltersInstanceProps,
  UseFiltersOptions,
  UseFiltersState,
  useGroupBy as useGroupByImpl,
  UseGroupByInstanceProps,
  UseGroupByOptions,
  UseGroupByState,
  UseResizeColumnsState,
  useRowSelect as useRowSelectImpl,
  UseRowSelectInstanceProps,
  UseRowSelectOptions,
  UseRowSelectState,
  useSortBy,
  UseSortByInstanceProps,
  UseSortByOptions,
  UseSortByState,
  useTable,
} from 'react-table';
import { useStateListener } from './contexts';

export { useRowRankColumn as featureRowRank } from '@lineup-lite/hooks';
export {
  useFilters as featureFilterColumns,
  useResizeColumns as featureResizeColumns,
  useSortBy as featureSortBy,
  useBlockLayout as featureDefaultLayout,
  useFlexLayout as featureFlexLayout,
} from 'react-table';

export type UseLineUpLiteTableOptions<D extends UnknownObject = UnknownObject> = TableOptions<D> &
  UseFiltersOptions<D> &
  UseExpandedOptions<D> &
  UseGroupByOptions<D> &
  UseRowSelectOptions<D> &
  UseSortByOptions<D> &
  UseRowExpandColumnTableOptions &
  UseSelectColumnTableOptions &
  UseRowRankColumnTableOptions;

export interface LineUpLiteState<D extends UnknownObject = UnknownObject>
  extends TableState<D>,
    UseFiltersState<D>,
    UseExpandedState<D>,
    UseGroupByState<D>,
    UseRowSelectState<D>,
    UseSortByState<D>,
    UseResizeColumnsState<D> {}

export interface LineUpLiteTableInstance<D extends UnknownObject = UnknownObject>
  extends TableInstance<D>,
    UseFiltersInstanceProps<D>,
    UseExpandedInstanceProps<D>,
    UseGroupByInstanceProps<D>,
    UseRowSelectInstanceProps<D>,
    UseSortByInstanceProps<D> {}

export interface UseLineUpLiteOptions<D extends UnknownObject = UnknownObject> extends UseLineUpLiteTableOptions<D> {
  defaultColumn?: Partial<LineUpLiteColumn<D>>;
  columns: LineUpLiteColumn<D>[];
  features: readonly (PluginHook<D> | PluginHook<D>[])[];

  onStateChange?: (state: LineUpLiteState) => void;
}

export function featureRowSelect<D extends UnknownObject = UnknownObject>(): PluginHook<D>[] {
  return [useRowSelectImpl, useRowSelectColumn];
}

export function featureSortAndGroupBy<D extends UnknownObject = UnknownObject>(): PluginHook<D>[] {
  return [useGroupByImpl, useSortBy, useExpanded, useRowExpandColumn];
}

/**
 * default feature set including: filters, sorting, grouping, row select, row rank, and default layout
 */
export function featureDefault<D extends UnknownObject = UnknownObject>(): PluginHook<D>[] {
  return [useFilters, ...featureSortAndGroupBy<D>(), ...featureRowSelect<D>(), useRowRankColumn, useBlockLayout];
}

function sortByPriority<D extends UnknownObject = UnknownObject>(
  a: [PluginHook<D>, number],
  b: [PluginHook<D>, number]
) {
  const specialOrders = ['useRowSelect', 'useRowRankColumn', 'useRowExpandColumn'];
  // ensure useRowExpandColumn is after useRowSelectColumn
  const isASpecial = specialOrders.indexOf(a[0].pluginName ?? '');
  const isBSpecial = specialOrders.indexOf(b[0].pluginName ?? '');
  if (isASpecial >= 0) {
    return isBSpecial >= 0 ? isASpecial - isBSpecial : 1;
  }
  if (isBSpecial >= 0) {
    return -1;
  }
  return a[1] - b[1];
}

export function useLineUpLite<D extends UnknownObject = UnknownObject>(
  { features, ...props }: UseLineUpLiteOptions<D>,
  ...extraPlugins: PluginHook<D>[]
): LineUpLiteTableInstance<D> {
  const tableProps: UseLineUpLiteTableOptions<D> & UseRowExpandColumnTableOptions = {
    groupByFn: columnSpecificGroupByFn,
    ...props,
  };
  const allPlugins = [...features.flat(), useStats, ...extraPlugins]
    .map((d, i) => [d, i] as [PluginHook<D>, number])
    .sort(sortByPriority)
    .map((r) => r[0]);
  const instance = useTable<D>(tableProps, ...allPlugins) as LineUpLiteTableInstance<D>;

  useStateListener(props, instance);
  return instance;
}
