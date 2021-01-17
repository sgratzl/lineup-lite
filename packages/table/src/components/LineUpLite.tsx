import {
  columnSpecificGroupByFn,
  useRowExpandColumn,
  UseRowExpandColumnTableOptions,
  useRowSelectColumn,
  useStats,
  useRowRankColumn,
} from '@lineup-lite/hooks';
import React, { Ref, useMemo, useRef } from 'react';
import {
  Column,
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
import { LineUpLiteTVirtualBody } from './LineUpLiteTVirtualBody';
import { FullColumn, ISharedLineUpProps } from './interfaces';
import { LineUpLiteTHead } from './LineUpLiteTHead';
import { LineUpLiteTR } from './LineUpLiteTR';
import { clsx } from './utils';

export { useSortBy, useResizeColumns, useFilters } from 'react-table';
export { useRowRankColumn } from '@lineup-lite/hooks';

export type FullTableOptions<D extends object> = TableOptions<D> &
  UseFiltersOptions<D> &
  UseExpandedOptions<D> &
  UseGroupByOptions<D> &
  UseRowSelectOptions<D> &
  UseSortByOptions<D>;

export interface ILineUpLiteProps<D extends object> extends FullTableOptions<D>, ISharedLineUpProps {
  defaultColumn: Partial<FullColumn<D>>;
  columns: (Column<D> & Partial<FullColumn<D>>)[];
  className?: string;
  style?: React.CSSProperties;
  plugins: (PluginHook<D> | PluginHook<D>[])[];
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
  const specialOrders = ['useRowRankColumn', 'useRowExpandColumn'];
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

export function useFullTable<D extends object>({ plugins, icons, ...props }: ILineUpLiteProps<D>) {
  const tableProps: FullTableOptions<D> & UseRowExpandColumnTableOptions = {
    groupByFn: columnSpecificGroupByFn,
    expandIcon: icons?.expandGroup,
    ...props,
  };
  const allPlugins = [...plugins.flat(), useStats, useBlockLayout]
    .map((d, i) => [d, i] as [PluginHook<D>, number])
    .sort(sortByPriority)
    .map((r) => r[0]);
  return useTable<D>(tableProps, ...allPlugins) as TableInstance<D> & UseFiltersInstanceProps<D>;
}

function useShared(props: ISharedLineUpProps): ISharedLineUpProps {
  return useMemo(
    () => ({
      styles: props.styles,
      classNames: props.classNames,
      icons: props.icons,
    }),
    [props.styles, props.classNames, props.icons]
  );
}

export const LineUpLite = /*!#__PURE__*/ React.forwardRef(function LineUpLite<D extends object>(
  props: ILineUpLiteProps<D>,
  ref: Ref<HTMLDivElement>
) {
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useFullTable<D>(props);

  const shared = useShared(props);

  return (
    <div
      {...getTableProps({
        className: clsx('lt-table', props.className),
        style: props.style,
      })}
      ref={ref}
    >
      <LineUpLiteTHead headerGroups={headerGroups} shared={shared} />
      <div
        {...getTableBodyProps({
          className: clsx('lt-tbody', props.classNames?.tbody),
          style: props.styles?.tbody,
        })}
      >
        {rows.map((row) => {
          prepareRow(row);
          return <LineUpLiteTR key={row.id} row={row} shared={shared} />;
        })}
      </div>
    </div>
  );
});

export default LineUpLite as <D extends object>(
  p: ILineUpLiteProps<D> & React.RefAttributes<HTMLDivElement>
) => React.ReactElement;

export interface ILineUpLiteVirtualProps<D extends object> extends ILineUpLiteProps<D> {
  estimatedSize: number | ((index: number) => number);
  overscan?: number;
}

export function LineUpLiteVirtual<D extends object>(props: ILineUpLiteProps<D> & ILineUpLiteVirtualProps<D>) {
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useFullTable<D>(props);

  const shared = useShared(props);

  const theadRef = useRef<HTMLDivElement>(null);

  return (
    <div
      {...getTableProps({
        className: clsx('lt-table', 'lt-table-virtual', props.className),
        style: props.style,
      })}
    >
      <LineUpLiteTHead headerGroups={headerGroups} shared={shared} virtualRef={theadRef} />
      <LineUpLiteTVirtualBody
        getTableBodyProps={getTableBodyProps}
        theadRef={theadRef}
        shared={shared}
        rows={rows}
        estimatedSize={props.estimatedSize}
        overscan={props.overscan}
        prepareRow={prepareRow}
      />
    </div>
  );
}
