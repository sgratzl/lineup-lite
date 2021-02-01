/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useCallback, MouseEvent } from 'react';
import type { ColumnInstance, Hooks, MetaBase, Row, UseRowSelectRowProps } from 'react-table';
import type { LineUpLiteColumn } from '../interfaces';
import IndeterminateCheckbox from './IndeterminateCheckbox';

export function useRowSelectColumn<D extends object = {}>(hooks: Hooks<D>) {
  hooks.visibleColumns.push(generateColumn);
}
useRowSelectColumn.pluginName = 'useRowSelectColumn';

export const USE_ROW_SELECT_COLUMN_I18N_EN = {
  selectGroup: 'Click to select all rows in this group',
  unselectGroup: 'Click to unselect all rows in this group',
  selectAll: 'Click to select all rows',
  unselectAll: 'Click to unselect all rows',
  selectRow: 'Click to select this row',
  unselectRow: 'Click to unselect this row',
};

export interface UseSelectColumnTableOptions {
  /**
   * i18n customizations
   */
  i18n?: Partial<typeof USE_ROW_SELECT_COLUMN_I18N_EN>;
  /**
   * width of the select column
   * @default 20
   */
  selectColumnWidth?: number;
}

function Cell(props: any) {
  const typedRow = props.row as Row<any> & UseRowSelectRowProps<any>;
  const rows = props.rows as (Row<any> & UseRowSelectRowProps<any>)[];
  const i18n = {
    ...USE_ROW_SELECT_COLUMN_I18N_EN,
    ...(props.i18n ?? {}),
  };
  const onClick = useCallback(
    (e: MouseEvent<HTMLInputElement>) => {
      if (!e.shiftKey) {
        return;
      }
      const rowIndex = rows.indexOf(typedRow);
      if (rowIndex <= 0) {
        return;
      }
      const shouldSelect = e.currentTarget.checked;
      let rangeStart = rowIndex;
      while (rangeStart > 0 && rows[rangeStart - 1].isSelected !== shouldSelect) {
        rangeStart--;
      }
      // select all others within range
      for (let i = rangeStart; i < rowIndex; i++) {
        rows[i].toggleRowSelected(shouldSelect);
      }
    },
    [typedRow, rows]
  );

  return (
    <div className="le-selection">
      <IndeterminateCheckbox
        {...props.row.getToggleRowSelectedProps()}
        onClick={onClick}
        title={props.row.isSelected ? i18n.unselectRow : i18n.selectRow}
      />
    </div>
  );
}

function Summary(props: any) {
  const i18n = {
    ...USE_ROW_SELECT_COLUMN_I18N_EN,
    ...(props.i18n ?? {}),
  };
  return (
    <div className="le-selection le-summary">
      <IndeterminateCheckbox
        {...props.getToggleAllRowsSelectedProps()}
        title={props.isAllRowsSelected ? i18n.unselectAll : i18n.selectAll}
      />
    </div>
  );
}

function Header() {
  return <div> </div>;
}

function generateColumn<D extends object = {}>(columns: ColumnInstance<D>[], meta: MetaBase<D>) {
  const width = (meta.instance as UseSelectColumnTableOptions).selectColumnWidth ?? 20;
  const selectionColumn: LineUpLiteColumn<D> = {
    id: 'selection',
    Header,
    Summary,
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
  return [selectionColumn, ...columns];
}
