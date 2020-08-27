import {
  BarRenderer,
  BoxPlotRenderer,
  categoricalFilter,
  CategoricalHistogramRenderer,
  CategoricalRenderer,
  categoricalStats,
  ColorRenderer,
  DateHistogramRenderer,
  DateRenderer,
  dateStats,
  NumberHistogramRenderer,
  numberStats,
  ProportionalSymbolRenderer,
  rangeFilter,
  textStats,
  TextSummaryRenderer,
  useStats,
  useRowSelectColumn,
  useRowExpandColumn,
  UseStatsColumnOptions,
} from '@lineup-lite/hooks';
import '@lineup-lite/hooks/dist/hooks.css';
import React from 'react';
import {
  Cell,
  Column,
  ColumnInstance,
  HeaderGroup,
  Row,
  TableInstance,
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
  UseResizeColumnsColumnOptions,
  useRowSelect,
  useTable,
} from 'react-table';
import { generateData } from '../data/genData';
import { observer } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/core/styles';
import { useStore } from '../store';

declare type FullColumn<D extends object> = Column<D> &
  UseGroupByColumnOptions<D> &
  UseResizeColumnsColumnOptions<D> &
  UseFiltersColumnOptions<D> &
  UseGlobalFiltersColumnOptions<D> &
  UseStatsColumnOptions<D> & {
    aggregateValue?(value: any, row: Row<D>, column: ColumnInstance<D>): any;
  };

function Table<D extends object>({ columns, data }: { columns: FullColumn<D>[]; data: D[] }) {
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useTable<D>(
    {
      columns,
      data,
    },
    useFilters,
    useGroupBy,
    useExpanded, // useGroupBy would be pretty useless without useExpanded ;)
    useStats,
    useRowSelect,
    useRowSelectColumn,
    useRowExpandColumn
  ) as TableInstance<D> & UseFiltersInstanceProps<D>;

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((col) => {
              const column = (col as unknown) as HeaderGroup<D> & UseGroupByColumnProps<D>;
              return (
                <th {...column.getHeaderProps()}>
                  {column.canGroupBy ? (
                    // If the column can be grouped, let's add a toggle
                    <span {...column.getGroupByToggleProps()}>{column.isGrouped ? '🛑 ' : '👊 '}</span>
                  ) : null}
                  {column.render('Header')}
                  {column.render('Summary')}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((rowR) => {
          prepareRow(rowR);
          const row = (rowR as unknown) as Row<D> & UseExpandedRowProps<D> & UseGroupByRowProps<D>;
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cellR) => {
                const cell = (cellR as unknown) as Cell<D> & UseGroupByCellProps<D>;
                return (
                  <td {...cell.getCellProps()}>
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
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
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
  {
    Header: 'String',
    accessor: 'string',
    Summary: TextSummaryRenderer,
    Aggregated: TextSummaryRenderer,
    aggregate: (v) => v,
    filter: 'text',
    stats: textStats,
  },
  {
    Header: 'Number',
    accessor: 'number',
    Cell: BarRenderer,
    Summary: NumberHistogramRenderer,
    Aggregated: NumberHistogramRenderer,
    aggregate: (v) => v,
    filter: rangeFilter,
    stats: numberStats({ min: 0, max: 10 }),
  },
  {
    Header: 'Number',
    accessor: 'number1',
    Cell: ColorRenderer,
    Summary: BoxPlotRenderer,
    Aggregated: BoxPlotRenderer,
    aggregate: (v) => v,
    filter: rangeFilter,
    stats: numberStats({ min: 0, max: 10 }),
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
  },
  {
    Header: 'Cat',
    accessor: 'cat',
    Cell: CategoricalRenderer,
    Summary: CategoricalHistogramRenderer,
    Aggregated: CategoricalHistogramRenderer,
    aggregate: (v) => v,
    filter: categoricalFilter,
    stats: categoricalStats,
  },
  {
    Header: 'Date',
    accessor: 'date',
    Cell: DateRenderer,
    Summary: DateHistogramRenderer,
    Aggregated: DateHistogramRenderer,
    aggregate: (v) => v,
    filter: rangeFilter,
    stats: dateStats,
  },
];

const useStyles = makeStyles(() => ({
  root: {
    flex: '1 1 0',
  },
}));

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
