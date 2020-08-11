import React from 'react';
import {
  Column,
  useTable,
  UseGroupByColumnOptions,
  UseResizeColumnsColumnOptions,
  UseFiltersColumnOptions,
  UseGlobalFiltersColumnOptions,
  useFilters,
  TableInstance,
  UseFiltersInstanceProps,
} from 'react-table';
import useStats, { UseStatsColumnOptions } from '../hooks/useStats';
import { generateData } from './data';
import BarRenderer from '../renderers/BarRenderer';
import CategoricalRenderer from '../renderers/CategoricalRenderer';
import ColorRenderer from '../renderers/ColorRenderer';
import ProportionalSymbolRenderer from '../renderers/ProportionalSymbolRenderer';
import NumberHistogramRenderer from '../renderers/NumberHistogramRenderer';
import DateRenderer from '../renderers/DateRenderer';
import DateHistogramRenderer from '../renderers/DateHistogramRenderer';
import CategoricalHistogramRenderer from '../renderers/CategoricalHistogramRenderer';
import { numberStats } from '../stats/numberStats';
import { categoricalStats } from '../stats/categoricalStats';
import { dateStats } from '../stats/dateStats';
import BoxPlotRenderer from '../renderers/BoxPlotRenderer';
import categoricalFilter from '../filters/categoricalFilter';
import rangeFilter from '../filters/rangeFilter';

declare type FullColumn<D extends object> = Column<D> &
  UseGroupByColumnOptions<D> &
  UseResizeColumnsColumnOptions<D> &
  UseFiltersColumnOptions<D> &
  UseGlobalFiltersColumnOptions<D> &
  UseStatsColumnOptions<D>;

function Table<D extends object>({ columns, data }: { columns: FullColumn<D>[]; data: D[] }) {
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useTable<D>(
    {
      columns,
      data,
    },
    useStats,
    useFilters
  ) as TableInstance<D> & UseFiltersInstanceProps<D>;

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>
                {column.render('Header')}
                {column.render('Summary')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
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
    Summary: () => null,
    filter: 'text',
    // stats: 'text'
  },
  {
    Header: 'Number',
    accessor: 'number',
    Cell: BarRenderer(),
    Summary: NumberHistogramRenderer(),
    filter: rangeFilter,
    stats: numberStats({ min: 0, max: 10 }),
  },
  {
    Header: 'Number',
    accessor: 'number1',
    Cell: ColorRenderer(),
    Summary: BoxPlotRenderer(),
    filter: rangeFilter,
    stats: numberStats({ min: 0, max: 10 }),
  },
  {
    Header: 'Number',
    accessor: 'number2',
    Cell: ProportionalSymbolRenderer(),
    Summary: NumberHistogramRenderer(),
    filter: rangeFilter,
    stats: numberStats({ min: 0, max: 10 }),
  },
  {
    Header: 'Cat',
    accessor: 'cat',
    Cell: CategoricalRenderer(),
    Summary: CategoricalHistogramRenderer(),
    filter: categoricalFilter,
    stats: categoricalStats(),
  },
  {
    Header: 'Date',
    accessor: 'date',
    Cell: DateRenderer(),
    Summary: DateHistogramRenderer(),
    filter: rangeFilter,
    stats: dateStats(),
  },
];

export default function TableExample() {
  const data = React.useMemo(
    () =>
      generateData({
        number: 3,
        date: 1,
      }) as IRow[],
    []
  );

  return <Table columns={columns} data={data} />;
}
