import {
  useRowExpandColumn,
  UseRowExpandColumnTableOptions,
  useRowSelectColumn,
  useStats,
  FullColumn as FullHookColumn,
  columnSpecificGroupByFn,
} from '@lineup-lite/hooks';
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
  ColumnInstance,
} from 'react-table';
import { clsx } from './utils';
import Toolbar from './Toolbar';
import { IIcons } from '../icons';

export type MultiCustomizeKeys = 'tbody' | 'tr' | 'thead' | 'th' | 'thGroup' | 'td' | 'header';

export type FullTableOptions<D extends object> = TableOptions<D> &
  UseFiltersOptions<D> &
  UseExpandedOptions<D> &
  UseGroupByOptions<D> &
  UseRowSelectOptions<D> &
  UseSortByOptions<D>;

export type FullColumn<D extends object> = FullHookColumn<D> & {
  canHide?: boolean;
};
export interface ILineUpLiteProps<D extends object> extends FullTableOptions<D> {
  defaultColumn: Partial<FullColumn<D>>;
  columns: (Column<D> & Partial<FullColumn<D>>)[];
  className?: string;
  classNames?: Partial<Record<MultiCustomizeKeys, string>>;
  style?: React.CSSProperties;
  styles?: Partial<Record<MultiCustomizeKeys, React.CSSProperties>>;
  /**
   * customize the icons to use
   */
  icons?: IIcons;
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
              .map((col) => {
                const column = (col as unknown) as HeaderGroup<D> &
                  UseGroupByColumnProps<D> &
                  UseResizeColumnsColumnProps<D>;
                return (
                  <div
                    {...column.getHeaderProps({
                      className: clsx(
                        'lt-th',
                        !column.canResize && 'lt-th-support',
                        props.classNames?.th,
                        clsx(column.isResizing && 'lt-column-resizing')
                      ),
                      style: props.styles?.th,
                    })}
                  >
                    {column.canResize ? (
                      <>
                        {column.canResize && (
                          <div
                            {...column.getResizerProps({
                              className: 'lt-column-resize-handle',
                            })}
                          />
                        )}
                        <div className={clsx('lt-header', props.classNames?.header)} style={props.styles?.header}>
                          {column.render('Header')}
                        </div>
                        <Toolbar {...col} icons={props.icons} />
                        {column.render('Summary')}
                      </>
                    ) : (
                      column.render('Summary')
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
              {row.cells
                .filter((d) => d.column.isVisible)
                .map((cellR) => {
                  const cell = (cellR as unknown) as Cell<D> & UseGroupByCellProps<D>;
                  const column = cell.column as FullColumn<D> & ColumnInstance<D> & UseResizeColumnsColumnProps<D>;
                  return (
                    <div
                      {...cell.getCellProps({
                        className: clsx('lt-td', !column.canResize && 'lt-td-support', props.classNames?.td),
                        style: props.styles?.td,
                      })}
                    >
                      {cell.isGrouped
                        ? cell.render(column.Group ? 'Group' : 'Cell')
                        : cell.isAggregated
                        ? cell.render('Aggregated')
                        : cell.render('Cell')}
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
