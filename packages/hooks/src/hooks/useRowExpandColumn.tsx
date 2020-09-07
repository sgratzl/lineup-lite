import React from 'react';
import {
  ColumnInstance,
  Hooks,
  Row,
  TableCellProps,
  UseExpandedRowProps,
  UseGroupByCellProps,
  UseTableCellProps,
} from 'react-table';
import { FullColumn } from '../interfaces';
import { cslx } from '../renderers/utils';

export function useRowExpandColumn<D extends object = {}>(hooks: Hooks<D>) {
  hooks.visibleColumns.push(generateColumn);
}
useRowExpandColumn.pluginName = 'useRowExpandColumn';

function Cell() {
  //props: TableCellProps & UseTableCellProps<any, any> & UseGroupByCellProps<any>) {
  // if ((props as any).allColumns.some((d: { isGrouped: boolean }) => d.isGrouped)) {
  //   return <div className="lt-expand-sub"></div>;
  // }
  return null;
}

function Aggregated(props: TableCellProps & UseTableCellProps<any, any> & UseGroupByCellProps<any>) {
  const row = props.row as Row<any> & UseExpandedRowProps<any>;
  if (!row.canExpand) {
    return null;
  }
  return (
    <div
      {...row.getToggleRowExpandedProps({
        className: cslx('lt-expand-agg', row.isExpanded && 'lt-expanded'),
      })}
    >
      ▲
    </div>
  );
}

function Summary(props: any) {
  if (props.allColumns.some((d: any) => d.isGrouped)) {
    return (
      <div
        {...props.getToggleAllRowsExpandedProps({
          className: cslx('lt-expand-agg', props.isAllRowsExpanded && 'lt-expanded'),
        })}
      >
        ▲
      </div>
    );
  }
  return null;
}

function Header() {
  return <div> </div>;
}

function generateColumn<D extends object = {}>(columns: ColumnInstance<D>[]) {
  const expandColumn: FullColumn<D> = {
    id: 'expand',
    Header,
    Summary,
    Aggregated,
    Cell,
    minWidth: 20,
    width: 20,
    maxWidth: 20,
    disableFilters: true,
    disableSortBy: true,
    disableGroupBy: true,
    disableResizing: true,
  };
  return [expandColumn, ...columns];
}
