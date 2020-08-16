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
  useRowSelect,
  useGroupBy,
  useExpanded,
  UseExpandedRowProps,
  UseGroupByRowProps,
  Cell,
  Row,
  UseGroupByCellProps,
  UseGroupByColumnProps,
  HeaderGroup,
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
import { textStats } from '../stats/textStats';
import TextSummaryRenderer from '../renderers/TextSummaryRenderer';

declare type FullColumn<D extends object> = Column<D> &
  UseGroupByColumnOptions<D> &
  UseResizeColumnsColumnOptions<D> &
  UseFiltersColumnOptions<D> &
  UseGlobalFiltersColumnOptions<D> &
  UseStatsColumnOptions<D>;

const IndeterminateCheckbox = React.forwardRef<HTMLInputElement, { indeterminate?: boolean }>(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef<HTMLInputElement>(null);
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      (resolvedRef as React.RefObject<HTMLInputElement>).current!.indeterminate = indeterminate ?? false;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);

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
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }: any) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Summary: () => null,
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }: any) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
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
        {rows.map((rowR, i) => {
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
    Summary: TextSummaryRenderer(),
    filter: 'text',
    stats: textStats(),
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
