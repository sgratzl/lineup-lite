import '@lineup-lite/components/dist/components.css';
import {
  asCategoricalColumn,
  asDateColumn,
  asNumberColumn,
  asStringColumn,
  BoxPlotRenderer,
  ColorRenderer,
  NumberHistogramRenderer,
  numberStats,
  ProportionalSymbolRenderer,
  rangeFilter,
  useRowExpandColumn,
  useRowSelectColumn,
  useStats,
  UseStatsColumnOptions,
} from '@lineup-lite/hooks';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import {
  Cell,
  Column,
  ColumnInstance,
  HeaderGroup,
  Row,
  TableInstance,
  useBlockLayout,
  useExpanded,
  UseExpandedRowProps,
  useFilters,
  UseFiltersColumnOptions,
  UseFiltersInstanceProps,
  UseGlobalFiltersColumnOptions,
  useGroupBy,
  UseGroupByCellProps,
  UseGroupByColumnOptions,
  UseGroupByColumnProps,
  UseGroupByRowProps,
  useResizeColumns,
  UseResizeColumnsColumnOptions,
  UseResizeColumnsColumnProps,
  useRowSelect,
  useTable,
} from 'react-table';
import { generateData } from '../data/genData';
import { useStore } from '../store';

declare type FullColumn<D extends object> = Column<D> &
  UseGroupByColumnOptions<D> &
  UseResizeColumnsColumnOptions<D> &
  UseFiltersColumnOptions<D> &
  UseGlobalFiltersColumnOptions<D> &
  UseStatsColumnOptions<D> & {
    aggregateValue?(value: any, row: Row<D>, column: ColumnInstance<D>): any;
  };

const useStyles = makeStyles(() => ({
  root: {
    flex: '1 1 0',
  },
  resizer: {
    display: 'inline-block',
    background: 'blue',
    width: 10,
    height: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
    transform: 'translateX(50%)',
    zIndex: 1,
    /* prevents from scrolling while dragging on touch devices */
    touchAction: 'none',
  },
  isResizing: {
    background: 'red',
  },
  tr: {
    marginBottom: 2,
  },
  td: {
    marginRight: 1,
  },
}));

function isSupportColumn(col: any) {
  return col.support === true;
}

function Table<D extends object>({ columns, data }: { columns: FullColumn<D>[]; data: D[] }) {
  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 400,
    }),
    []
  );
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useTable<D>(
    {
      columns,
      data,
      defaultColumn,
    },
    useFilters,
    useGroupBy,
    useExpanded, // useGroupBy would be pretty useless without useExpanded ;)
    useStats,
    useRowSelect,
    useRowSelectColumn,
    useRowExpandColumn,
    useBlockLayout,
    useResizeColumns
  ) as TableInstance<D> & UseFiltersInstanceProps<D>;

  const classes = useStyles();

  return (
    <div {...getTableProps()}>
      <div>
        {headerGroups.map((headerGroup) => (
          <div {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((col) => {
              const column = (col as unknown) as HeaderGroup<D> &
                UseGroupByColumnProps<D> &
                UseResizeColumnsColumnProps<D>;
              return (
                <div {...column.getHeaderProps()}>
                  {column.canGroupBy ? (
                    // If the column can be grouped, let's add a toggle
                    <span {...column.getGroupByToggleProps()}>{column.isGrouped ? '🛑 ' : '👊 '}</span>
                  ) : null}
                  {column.render('Header')}
                  {column.render('Summary')}
                  {!isSupportColumn(column) && (
                    <div
                      {...column.getResizerProps()}
                      className={clsx(classes.resizer, column.isResizing && classes.isResizing)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div {...getTableBodyProps()}>
        {rows.map((rowR) => {
          prepareRow(rowR);
          const row = (rowR as unknown) as Row<D> & UseExpandedRowProps<D> & UseGroupByRowProps<D>;
          return (
            <div {...row.getRowProps()} className={classes.tr}>
              {row.cells.map((cellR) => {
                const cell = (cellR as unknown) as Cell<D> & UseGroupByCellProps<D>;
                return (
                  <div {...cell.getCellProps()} className={classes.td}>
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
}

export interface IRow {
  string: string;
  number: number;
  number1: number;
  number2: number;
  date: Date;
  cat: 'c1' | 'c2' | 'c3';
}

const columns: FullColumn<IRow>[] = [
  asStringColumn({
    Header: 'String',
    accessor: 'string',
    minWidth: 100,
  }),
  asNumberColumn(
    {
      Header: 'Number',
      accessor: 'number',
      minWidth: 100,
    },
    { min: 0, max: 10 }
  ),
  {
    Header: 'Number',
    accessor: 'number1',
    Cell: ColorRenderer,
    Summary: BoxPlotRenderer,
    Aggregated: BoxPlotRenderer,
    aggregate: (v) => v,
    filter: rangeFilter,
    stats: numberStats({ min: 0, max: 10 }),
    minWidth: 100,
  },
  {
    Header: 'Number',
    accessor: 'number2',
    Cell: ProportionalSymbolRenderer,
    Summary: NumberHistogramRenderer,
    Aggregated: NumberHistogramRenderer,
    aggregate: (v) => v,
    filter: rangeFilter,
    stats: numberStats({ min: 0, max: 10 }),
    minWidth: 100,
  },
  asCategoricalColumn({
    Header: 'Cat',
    accessor: 'cat',
    minWidth: 100,
  }),
  asDateColumn({
    Header: 'Date',
    accessor: 'date',
    minWidth: 100,
  }),
];

export default observer(() => {
  const store = useStore();
  const classes = useStyles();
  const data = React.useMemo(
    () =>
      generateData({
        number: 3,
        date: 1,
      }) as IRow[],
    []
  );
  return (
    <div data-id={store} className={classes.root}>
      <Table columns={columns} data={data} />
    </div>
  );
});
