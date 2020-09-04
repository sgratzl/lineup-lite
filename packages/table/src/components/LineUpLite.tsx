import { useRowExpandColumn, useRowSelectColumn, useStats, FullColumn } from '@lineup-lite/hooks';
import React, { Ref } from 'react';
import {
  Cell,
  Column,
  HeaderGroup,
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
  UseGroupByCellProps,
  UseGroupByColumnProps,
  UseGroupByOptions,
  UseGroupByRowProps,
  useResizeColumns,
  UseResizeColumnsColumnProps,
  UseRowSelectOptions,
  UseSortByOptions,
  useRowSelect,
  useTable,
  useSortBy,
} from 'react-table';
import { clsx } from './utils';
import Toolbar from './Toolbar';

export type MultiCustomizeKeys = 'tbody' | 'tr' | 'thead' | 'th' | 'thGroup' | 'td' | 'header';

export type FullTableOptions<D extends object> = TableOptions<D> &
  UseFiltersOptions<D> &
  UseExpandedOptions<D> &
  UseGroupByOptions<D> &
  UseRowSelectOptions<D> &
  UseSortByOptions<D>;

export interface ILineUpLiteProps<D extends object> extends FullTableOptions<D> {
  columns: (Column<D> & Partial<FullColumn<D>>)[];
  className?: string;
  classNames?: Partial<Record<MultiCustomizeKeys, string>>;
  style?: React.CSSProperties;
  styles?: Partial<Record<MultiCustomizeKeys, React.CSSProperties>>;
}

export const LineUpLite = /*!#__PURE__*/ React.forwardRef(function LineUpLite<D extends object>(
  props: ILineUpLiteProps<D>,
  ref: Ref<HTMLDivElement>
) {
  const tableProps: FullTableOptions<D> = {
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

  return (
    <div
      {...getTableProps({
        className: clsx('lt-table', props.className),
        style: props.style,
      })}
      ref={ref}
    >
      <div className={clsx('lt-th-group', props.classNames?.thead)} style={props.styles?.thead}>
        {headerGroups.map((headerGroup) => (
          <div
            {...headerGroup.getHeaderGroupProps({
              className: clsx('lt-th-group', props.classNames?.thGroup),
              style: props.styles?.thGroup,
            })}
          >
            {headerGroup.headers.map((col) => {
              const column = (col as unknown) as HeaderGroup<D> &
                UseGroupByColumnProps<D> &
                UseResizeColumnsColumnProps<D>;
              return (
                <div
                  {...column.getHeaderProps({
                    className: clsx('lt-th', props.classNames?.th, clsx(column.isResizing && 'lt-column-resizing')),
                    style: props.styles?.th,
                  })}
                >
                  <div className={clsx('lt-header', props.classNames?.header)} style={props.styles?.header}>
                    {column.render('Header')}
                  </div>
                  <Toolbar {...col} />
                  {column.render('Summary')}
                  {column.canResize && (
                    <div
                      {...column.getResizerProps({
                        className: 'lt-column-resize-handle',
                      })}
                    />
                  )}
                </div>
              );
            })}
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
              {row.cells.map((cellR) => {
                const cell = (cellR as unknown) as Cell<D> & UseGroupByCellProps<D>;
                return (
                  <div
                    {...cell.getCellProps({
                      className: clsx('lt-td', props.classNames?.td),
                      style: props.styles?.td,
                    })}
                  >
                    {cell.isGrouped ? (
                      // If it's a grouped cell, add an expander and row count
                      <>
                        <span {...row.getToggleRowExpandedProps()}>{row.isExpanded ? '👇' : '👉'}</span>{' '}
                        {cell.render('Cell')} ({row.subRows.length})
                      </>
                    ) : cell.isAggregated ? (
                      // If the cell is aggregated, use the Aggregated
                      // renderer for cell
                      cell.render('Aggregated')
                    ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                      // Otherwise, just render the regular cell
                      cell.render('Cell')
                    )}
                  </div>
                );
              })}
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
