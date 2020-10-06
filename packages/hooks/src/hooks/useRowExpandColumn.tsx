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

export interface UseRowExpandColumnTableOptions {
  expandIcon?: React.ComponentType;
}

export function useRowExpandColumn<D extends object = {}>(hooks: Hooks<D>) {
  hooks.visibleColumns.push(generateColumn);
}
useRowExpandColumn.pluginName = 'useRowExpandColumn';

// https://remixicon.com/
function ArrowDropRightLine() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1.2em">
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M12.172 12L9.343 9.172l1.414-1.415L15 12l-4.243 4.243-1.414-1.415z" />
    </svg>
  );
}

function Cell() {
  //props: TableCellProps & UseTableCellProps<any, any> & UseGroupByCellProps<any>) {
  // if ((props as any).allColumns.some((d: { isGrouped: boolean }) => d.isGrouped)) {
  //   return <div className="lt-expand-sub"></div>;
  // }
  return null;
}

function Aggregated(
  props: TableCellProps & UseTableCellProps<any, any> & UseGroupByCellProps<any> & UseRowExpandColumnTableOptions
) {
  const row = props.row as Row<any> & UseExpandedRowProps<any> & { depth: number };
  if (!row.canExpand) {
    return null;
  }
  return (
    <div
      {...row.getToggleRowExpandedProps({
        className: cslx('lt-expand-agg', `lt-expand-${row.depth}`, row.isExpanded && 'lt-expanded'),
      })}
    >
      {props.expandIcon ? <props.expandIcon /> : <ArrowDropRightLine />}
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
        {props.expandIcon ? <props.expandIcon /> : <ArrowDropRightLine />}
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
