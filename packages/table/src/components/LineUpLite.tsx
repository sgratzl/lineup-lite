import {
  columnSpecificGroupByFn,
  useRowExpandColumn,
  UseRowExpandColumnTableOptions,
  useRowSelectColumn,
  useStats,
} from '@lineup-lite/hooks';
import React, { Ref, useMemo } from 'react';
import {
  Column,
  Row,
  TableInstance,
  TableOptions,
  useBlockLayout,
  useExpanded,
  UseExpandedOptions,
  UseExpandedRowProps,
  useFilters,
  UseFiltersInstanceProps,
  UseFiltersOptions,
  useGroupBy,
  UseGroupByOptions,
  UseGroupByRowProps,
  useResizeColumns,
  useRowSelect,
  UseRowSelectOptions,
  useSortBy,
  UseSortByOptions,
  useTable,
} from 'react-table';
import { FullColumn, ISharedLineUpProps } from './interfaces';
import { LineUpLiteTD } from './LineUpLiteTD';
import { LineUpLiteTH } from './LineUpLiteTH';
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

export const LineUpLite = /*!#__PURE__*/ React.forwardRef(function LineUpLite<D extends object>(
  props: ILineUpLiteProps<D>,
  ref: Ref<HTMLDivElement>
) {
  const tableProps: FullTableOptions<D> & UseRowExpandColumnTableOptions = {
    groupByFn: columnSpecificGroupByFn,
    expandIcon: props.icons?.expandGroup,
    ...props,
  };
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useTable<D>(
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

  const shared: ISharedLineUpProps = useMemo(
    () => ({
      styles: props.styles,
      classNames: props.classNames,
      icons: props.icons,
    }),
    [props.styles, props.classNames, props.icons]
  );

  return (
    <div
      {...getTableProps({
        className: clsx('lt-table', props.className),
        style: props.style,
      })}
      ref={ref}
    >
      <div className={clsx('lt-thead', props.classNames?.thead)} style={props.styles?.thead}>
        {headerGroups.map((headerGroup) => (
          <div
            {...headerGroup.getHeaderGroupProps({
              className: clsx('lt-th-group', props.classNames?.thGroup),
              style: props.styles?.thGroup,
            })}
          >
            {headerGroup.headers
              .filter((d) => d.isVisible)
              .map((col) => (
                <LineUpLiteTH key={col.id} col={col} shared={shared} />
              ))}
          </div>
        ))}
      </div>
      <div
        {...getTableBodyProps({
          className: clsx('lt-tbody', props.classNames?.tbody),
          style: props.styles?.tbody,
        })}
      >
        {rows.map((rowR) => {
          prepareRow(rowR);
          const row = (rowR as unknown) as Row<D> & UseExpandedRowProps<D> & UseGroupByRowProps<D>;
          return (
            <div
              {...row.getRowProps({
                className: clsx('lt-tr', props.classNames?.tr),
                style: props.styles?.tr,
              })}
            >
              {row.cells
                .filter((d) => d.column.isVisible)
                .map((cell) => (
                  <LineUpLiteTD key={cell.column.id} cell={cell} shared={shared} />
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default LineUpLite as <D extends object>(
  p: ILineUpLiteProps<D> & React.RefAttributes<HTMLDivElement>
) => React.ReactElement;
