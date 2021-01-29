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
  UseGroupByRowProps,
} from 'react-table';
import type { LineUpLiteColumn } from '../interfaces';

export interface UseRankRowProps {
  rank: number;
}

export function useRowRankColumn<D extends object = {}>(hooks: Hooks<D>) {
  hooks.visibleColumns.push(generateColumn);
  hooks.useInstance.push(useInstance);
}
useRowRankColumn.pluginName = 'useRowRankColumn';

function Cell(props: TableCellProps & UseTableCellProps<any, any>) {
  return <div className="lt-rank">{`${((props.row as unknown) as UseRankRowProps).rank.toLocaleString()}.`}</div>;
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
      <span>{`${firstRow.rank.toLocaleString()}.`}</span>
      <span className="lt-rank-agg-spacer" />
      <span>{`${lastRow.rank.toLocaleString()}.`}</span>
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
  const rankColumn: LineUpLiteColumn<D> = {
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
    canHide: false,
  };
  return [rankColumn, ...columns];
}

function useInstance<D extends object>(instance: TableInstance<D>) {
  ensurePluginOrder(instance.plugins, ['useFilters', 'useGroupBy', 'useSortBy'], 'useRowRankColumn');

  const extendedInstance = (instance as unknown) as TableInstance<D> &
    UseFiltersInstanceProps<D> &
    UseGroupByInstanceProps<D>;

  let rank = 1;
  let groupRank = 1;
  extendedInstance.flatRows.forEach((row) => {
    if (((row as unknown) as UseGroupByRowProps<D>).isGrouped) {
      ((row as unknown) as UseRankRowProps).rank = groupRank++;
      return;
    }
    ((row as unknown) as UseRankRowProps).rank = rank++;
  });
}
