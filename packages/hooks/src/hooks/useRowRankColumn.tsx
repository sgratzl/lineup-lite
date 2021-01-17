import React from 'react';
import {
  ColumnInstance,
  ensurePluginOrder,
  Hooks,
  TableCellProps,
  TableInstance,
  UseFiltersInstanceProps,
  UseGroupByInstanceProps,
  UseTableCellProps,
} from 'react-table';
import { FullColumn } from '../interfaces';

export interface UseRankRowProps {
  rank: number;
}

export function useRowRankColumn<D extends object = {}>(hooks: Hooks<D>) {
  hooks.visibleColumns.push(generateColumn);
  hooks.useInstance.push(useInstance);
}
useRowRankColumn.pluginName = 'useRowRankColumn';

function Cell(props: TableCellProps & UseTableCellProps<any, any>) {
  return <div className="lt-rank">{`${((props.row as unknown) as UseRankRowProps).rank}.`}</div>;
}

function Aggregated(props: TableCellProps & UseTableCellProps<any, any>) {
  const group = props.row.subRows;
  if (group.length === 0) {
    return <div className="lt-rank-agg" />;
  }
  const firstRow = (group[0] as unknown) as UseRankRowProps;
  const lastRow = (group[group.length - 1] as unknown) as UseRankRowProps;
  return (
    <div className="lt-rank-agg">
      <span>{`${firstRow.rank}.`}</span>
      <span>{`${lastRow.rank}.`}</span>
    </div>
  );
}

function Summary() {
  return null;
}

function Header() {
  return <div> </div>;
}

function generateColumn<D extends object = {}>(columns: ColumnInstance<D>[]) {
  const rankColumn: FullColumn<D> = {
    id: 'rank',
    Header,
    Summary,
    Aggregated,
    Cell,
    minWidth: 30,
    width: 40,
    maxWidth: 50,
    disableFilters: true,
    disableSortBy: true,
    disableGroupBy: true,
  };
  return [rankColumn, ...columns];
}

function useInstance<D extends object>(instance: TableInstance<D>) {
  ensurePluginOrder(instance.plugins, ['useFilters', 'useGroupBy', 'useSortBy'], 'useStats');

  const extendedInstance = (instance as unknown) as TableInstance<D> &
    UseFiltersInstanceProps<D> &
    UseGroupByInstanceProps<D>;

  (extendedInstance.nonGroupedFlatRows ?? extendedInstance.flatRows).forEach((row, i) => {
    ((row as unknown) as UseRankRowProps).rank = i + 1;
  });
}