/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

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
  MetaBase,
  Renderer,
  CellProps,
} from 'react-table';
import type { AnyObject, LineUpLiteColumn, UnknownObject } from '../interfaces';

export interface UseRankRowProps {
  rank: number;
}

export function useRowRankColumn<D extends AnyObject = UnknownObject>(hooks: Hooks<D>): void {
  hooks.visibleColumns.push(generateColumn);
  hooks.useInstance.push(useInstance);
}
useRowRankColumn.pluginName = 'useRowRankColumn';

function Cell(props: TableCellProps & UseTableCellProps<UnknownObject, unknown>) {
  return <div className="lt-rank">{`${(props.row as unknown as UseRankRowProps).rank.toLocaleString()}.`}</div>;
}

function Aggregated(props: TableCellProps & UseTableCellProps<UnknownObject, unknown>) {
  const group = props.row.subRows;
  if (group.length === 0) {
    return <div className="lt-rank-agg" />;
  }
  const firstRow = group[0] as unknown as UseRankRowProps;
  const lastRow = group[group.length - 1] as unknown as UseRankRowProps;
  return (
    <div className="lt-rank-agg">
      <span>{`${firstRow.rank.toLocaleString()}.`}</span>
      <span className="lt-rank-agg-spacer" />
      <span>{`${lastRow.rank.toLocaleString()}.`}</span>
    </div>
  );
}

function Summary() {
  return <div className="lt-summary" />;
}

function Header() {
  return <div>#</div>;
}

export interface UseRowRankColumnTableOptions {
  /**
   * width of the rank column
   * @default 40
   */
  rankColumnWidth?: number;
}

function generateColumn<D extends AnyObject = UnknownObject>(columns: ColumnInstance<D>[], meta: MetaBase<D>) {
  const width = (meta.instance as UseRowRankColumnTableOptions).rankColumnWidth ?? 40;
  const rankColumn: LineUpLiteColumn<D> = {
    id: 'rank',
    Header,
    Summary,
    Aggregated: Aggregated as unknown as Renderer<CellProps<D>>,
    Cell: Cell as unknown as Renderer<CellProps<D>>,
    minWidth: width - 10,
    width,
    maxWidth: width + 10,
    disableFilters: true,
    disableSortBy: true,
    disableGroupBy: true,
    canHide: false,
    isSupport: true,
  };
  return [rankColumn, ...columns];
}

function useInstance<D extends AnyObject = UnknownObject>(instance: TableInstance<D>) {
  ensurePluginOrder(instance.plugins, ['useFilters', 'useGroupBy', 'useSortBy'], 'useRowRankColumn');

  const extendedInstance = instance as unknown as TableInstance<D> &
    UseFiltersInstanceProps<D> &
    UseGroupByInstanceProps<D>;

  let rank = 1;
  let groupRank = 1;
  extendedInstance.flatRows.forEach((row) => {
    if ((row as unknown as UseGroupByRowProps<D>).isGrouped) {
      // eslint-disable-next-line no-param-reassign
      (row as unknown as UseRankRowProps).rank = groupRank;
      groupRank += 1;
      return;
    }
    // eslint-disable-next-line no-param-reassign
    (row as unknown as UseRankRowProps).rank = rank;
    rank += 1;
  });
}
