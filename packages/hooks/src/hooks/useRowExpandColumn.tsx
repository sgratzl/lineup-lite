/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { ComponentType } from 'react';
import type {
  ColumnInstance,
  Hooks,
  MetaBase,
  Row,
  TableCellProps,
  UseExpandedRowProps,
  UseGroupByCellProps,
  UseTableCellProps,
} from 'react-table';
import type { LineUpLiteColumn } from '../interfaces';
import { clsx } from '@lineup-lite/components';

export const USE_EXPAND_COLUMN_I18N_EN = {
  expandGroup: 'Click to expand this group',
  collapseGroup: 'Click to collapse this group',
  expandAllGroups: 'Click to expand all groups',
  collapseAllGroups: 'Click to collapse all groups',
};

export interface UseRowExpandColumnTableOptions {
  /**
   * icon to use for the expand icon
   * @default '▸'
   */
  icons?: {
    expandGroup?: ComponentType;
  };
  /**
   * i18n customizations
   */
  i18n?: Partial<typeof USE_EXPAND_COLUMN_I18N_EN>;
  /**
   * width of the expand column
   * @default 20
   */
  expandColumnWidth?: number;
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
  const i18n = {
    ...USE_EXPAND_COLUMN_I18N_EN,
    ...(props.i18n ?? {}),
  };
  return (
    <button
      {...row.getToggleRowExpandedProps({
        className: clsx('lt-expand-agg', `lt-expand-${row.depth}`, row.isExpanded && 'lt-expanded'),
      })}
      title={row.isExpanded ? i18n.collapseGroup : i18n.expandGroup}
    >
      {props.icons?.expandGroup ? <props.icons.expandGroup /> : <ArrowDropRightLine />}
    </button>
  );
}

function Summary(props: any) {
  if (!props.allColumns.some((d: any) => d.isGrouped)) {
    return <div className="lt-summary" />;
  }
  const i18n = {
    ...USE_EXPAND_COLUMN_I18N_EN,
    ...(props.i18n ?? {}),
  };
  return (
    <div className="lt-summary">
      <button
        {...props.getToggleAllRowsExpandedProps({
          className: clsx('lt-expand-agg', props.isAllRowsExpanded && 'lt-expanded'),
        })}
        title={props.isAllRowsExpanded ? i18n.collapseAllGroups : i18n.expandAllGroups}
      >
        {props.icons?.expandGroup ? <props.icons.expandGroup /> : <ArrowDropRightLine />}
      </button>
    </div>
  );
}

function Header() {
  return <></>;
}

function generateColumn<D extends object = {}>(columns: ColumnInstance<D>[], meta: MetaBase<D>) {
  const width = (meta.instance as UseRowExpandColumnTableOptions).expandColumnWidth ?? 20;
  const expandColumn: LineUpLiteColumn<D> = {
    id: 'expand',
    Header,
    Summary,
    Aggregated,
    Cell,
    minWidth: width,
    width,
    maxWidth: width,
    disableFilters: true,
    disableSortBy: true,
    disableGroupBy: true,
    disableResizing: true,
    canHide: false,
  };
  return [expandColumn, ...columns];
}
