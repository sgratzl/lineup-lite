import React from 'react';
import type {
  ColumnInstance,
  Hooks,
  Row,
  TableCellProps,
  UseExpandedRowProps,
  UseGroupByCellProps,
  UseTableCellProps,
} from 'react-table';
import type { LineUpLiteColumn } from '../interfaces';
import { cslx } from '../renderers/utils';

export interface UseRowExpandColumnTableOptions {
  expandIcon?: React.ComponentType;
}

export function useRowExpandColumn<D extends object = {}>(hooks: Hooks<D>) {
  hooks.visibleColumns.push(generateColumn);
}
useRowExpandColumn.pluginName = 'useRowExpandColumn';

function ArrowDropRightLine() {
  return <>▸</>;
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
    <button
      {...row.getToggleRowExpandedProps({
        className: cslx('lt-expand-agg', `lt-expand-${row.depth}`, row.isExpanded && 'lt-expanded'),
      })}
      title="Expand/Collapse this group"
    >
      {props.expandIcon ? <props.expandIcon /> : <ArrowDropRightLine />}
    </button>
  );
}

function Summary(props: any) {
  if (props.allColumns.some((d: any) => d.isGrouped)) {
    return (
      <button
        {...props.getToggleAllRowsExpandedProps({
          className: cslx('lt-expand-agg', props.isAllRowsExpanded && 'lt-expanded'),
        })}
        title="Expand/Collapse all groups"
      >
        {props.expandIcon ? <props.expandIcon /> : <ArrowDropRightLine />}
      </button>
    );
  }
  return null;
}

function Header() {
  return <div> </div>;
}

function generateColumn<D extends object = {}>(columns: ColumnInstance<D>[]) {
  const expandColumn: LineUpLiteColumn<D> = {
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
    canHide: false,
  };
  return [expandColumn, ...columns];
}
