import React from 'react';
import { Column, useTable, UseGroupByColumnOptions, UseResizeColumnsColumnOptions, UseFiltersColumnOptions, UseGlobalFiltersColumnOptions } from 'react-table';
import useStats, { UseStatsColumnOptions } from '../hooks/useStats';
import { generateData } from './data';
import BarRenderer from '../renderers/BarRenderer';
import CategoricalRenderer from '../renderers/CategoricalRenderer';

declare type FullColumn<D extends object> = (Column<D> & UseGroupByColumnOptions<D> & UseResizeColumnsColumnOptions<D> & UseFiltersColumnOptions<D> & UseGlobalFiltersColumnOptions<D> & UseStatsColumnOptions<D>);

function Table<D extends object>({ columns, data }: { columns: FullColumn<D>[], data: D[] }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<D>(
    {
      columns,
      data,
    },
    useStats
  )

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>
                {column.render('Header')}
                {/* {column.render('Stats')} */}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <td
                    {...cell.getCellProps()}
                  >{
                      cell.render('Cell')
                    }
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export interface IRow {
  string: string;
  number: number;
  cat: 'c1' | 'c2' | 'c3';
}


const columns: FullColumn<IRow>[] = [
  {
    Header: 'String',
    accessor: 'string',
    // stats: 'text'
  },
  {
    Header: 'Number',
    accessor: 'number',
    Cell: BarRenderer({ scale: (v: number) => v / 10 }),
    // stats: 'number'
  },
  {
    Header: 'Cat',
    accessor: 'cat',
    Cell: CategoricalRenderer()
    // stats: 'categorical'
  },
]

export default function TableExample() {

  const data = React.useMemo(() => generateData({}) as IRow[], [])

  return (
    <Table columns={columns} data={data} />
  );
}