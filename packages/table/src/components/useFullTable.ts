import {
  columnSpecificGroupByFn,
  useRowExpandColumn,
  UseRowExpandColumnTableOptions,
  useRowSelectColumn,
  useStats,
  useRowRankColumn,
  LineUpLiteColumn,
} from '@lineup-lite/hooks';
import { actionIconsText } from '../icons';
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
import type { FullColumn } from './interfaces';

export { useSortBy, useResizeColumns, useFilters } from 'react-table';
export { useRowRankColumn } from '@lineup-lite/hooks';

export type FullTableOptions<D extends object> = TableOptions<D> &
  UseFiltersOptions<D> &
  UseExpandedOptions<D> &
  UseGroupByOptions<D> &
  UseRowSelectOptions<D> &
  UseSortByOptions<D>;

export interface IFullTableProps<D extends object> extends FullTableOptions<D> {
  defaultColumn?: Partial<FullColumn<D>>;
  columns: LineUpLiteColumn<D>[];
  plugins: (PluginHook<D> | PluginHook<D>[])[];
  /**
   * customize the icons to use
   */
  icons?: {
    expandGroup?: React.ComponentType;
  };
}

export function useRowSelect<D extends object>(): PluginHook<D>[] {
  return [useRowSelectImpl, useRowSelectColumn];
}

export function useSortAndGroupBy<D extends object>(): PluginHook<D>[] {
  return [useGroupByImpl, useSortBy, useExpanded, useRowExpandColumn];
}

export function useDefaultFeatures<D extends object>(): PluginHook<D>[] {
  return [useResizeColumns, useFilters, ...useSortAndGroupBy<D>(), ...useRowSelect<D>(), useRowRankColumn];
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

export function useFullTable<D extends object>(
  { plugins, icons, ...props }: IFullTableProps<D>,
  ...extraPlugins: PluginHook<D>[]
) {
  const tableProps: FullTableOptions<D> & UseRowExpandColumnTableOptions = {
    groupByFn: columnSpecificGroupByFn,
    expandIcon: icons?.expandGroup ?? actionIconsText().expandGroup,
    ...props,
  };
  const allPlugins = [...plugins.flat(), useStats, useBlockLayout, ...extraPlugins]
    .map((d, i) => [d, i] as [PluginHook<D>, number])
    .sort(sortByPriority)
    .map((r) => r[0]);
  return useTable<D>(tableProps, ...allPlugins) as TableInstance<D> & UseFiltersInstanceProps<D>;
}
