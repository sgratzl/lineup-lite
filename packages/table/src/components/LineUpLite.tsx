import {
  columnSpecificGroupByFn,
  useRowExpandColumn,
  UseRowExpandColumnTableOptions,
  useRowSelectColumn,
  useStats,
} from '@lineup-lite/hooks';
import React, { Ref, useCallback, useMemo, useRef, useLayoutEffect } from 'react';
import {
  Column,
  TableInstance,
  TableOptions,
  useBlockLayout,
  useExpanded,
  UseExpandedOptions,
  useFilters,
  UseFiltersInstanceProps,
  UseFiltersOptions,
  useGroupBy,
  UseGroupByOptions,
  useResizeColumns,
  useRowSelect,
  UseRowSelectOptions,
  useSortBy,
  UseSortByOptions,
  useTable,
} from 'react-table';
import { useVirtual } from 'react-virtual';
import { FullColumn, ISharedLineUpProps } from './interfaces';
import { LineUpLiteTHead } from './LineUpLiteTHead';
import { LineUpLiteTR } from './LineUpLiteTR';
import { clsx } from './utils';

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
}

export function useFullTable<D extends object>(props: ILineUpLiteProps<D>) {
  const tableProps: FullTableOptions<D> & UseRowExpandColumnTableOptions = {
    groupByFn: columnSpecificGroupByFn,
    expandIcon: props.icons?.expandGroup,
    ...props,
  };
  return useTable<D>(
    tableProps,
    useFilters,
    useGroupBy,
    useSortBy,
    useExpanded, // useGroupBy would be pretty useless without useExpanded ;)
    useStats,
    useRowSelect,
    useRowSelectColumn,
    useRowExpandColumn,
    useBlockLayout,
    useResizeColumns
  ) as TableInstance<D> & UseFiltersInstanceProps<D>;
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
        {rows.map((row) => (
          <LineUpLiteTR key={row.id} row={row} shared={shared} prepareRow={prepareRow} />
        ))}
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

  const ref = useRef<HTMLDivElement>(null);
  const theadRef = useRef<HTMLDivElement>(null);

  const givenEstimate = props.estimatedSize;
  const estimateSize = useCallback(
    (index: number) => (typeof givenEstimate === 'function' ? givenEstimate(index) : givenEstimate),
    [givenEstimate]
  );
  const rowVirtualizer = useVirtual({
    size: props.data.length,
    overscan: props.overscan ?? 5,
    parentRef: ref,
    estimateSize,
  });

  useLayoutEffect(() => {
    const elem = ref.current;
    const thead = theadRef.current;

    if (!elem || !thead) {
      return;
    }
    const scrollListener = (e: Event) => {
      const scrollLeft = (e.currentTarget as HTMLDivElement).scrollLeft;
      if (Math.abs(thead.scrollLeft - scrollLeft) > 1) {
        thead.scrollLeft = scrollLeft;
      }
    };
    elem.addEventListener('scroll', scrollListener, {
      passive: true,
    });
    return () => {
      elem.removeEventListener('scroll', scrollListener);
    };
  }, [ref, theadRef]);

  return (
    <div
      {...getTableProps({
        className: clsx('lt-table', 'lt-table-virtual', props.className),
        style: props.style,
      })}
    >
      <LineUpLiteTHead headerGroups={headerGroups} shared={shared} virtualRef={theadRef} />
      <div
        {...getTableBodyProps({
          className: clsx('lt-tbody', 'lt-tbody-virtual', props.classNames?.tbody),
          style: props.styles?.tbody,
        })}
        ref={ref}
      >
        <div
          style={{
            height: `${rowVirtualizer.totalSize}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.virtualItems.map((item) => {
            const row = rows[item.index];
            return <LineUpLiteTR key={row.id} row={row} shared={shared} prepareRow={prepareRow} virtualItem={item} />;
          })}
        </div>
      </div>
    </div>
  );
}
