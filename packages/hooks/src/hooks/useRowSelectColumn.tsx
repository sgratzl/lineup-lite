/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useCallback, MouseEvent } from 'react';
import type {
  ColumnInstance,
  Hooks,
  MetaBase,
  Row,
  UseRowSelectRowProps,
  TableToggleAllRowsSelectedProps,
} from 'react-table';
import type { AnyObject, LineUpLiteColumn, UnknownObject } from '../interfaces';
import IndeterminateCheckbox from './IndeterminateCheckbox';

export type { TableToggleAllRowsSelectedProps } from 'react-table';

export function useRowSelectColumn<D extends AnyObject = UnknownObject>(hooks: Hooks<D>): void {
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

  selectCheckboxComponent?: React.ComponentType<TableToggleAllRowsSelectedProps>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Cell(props: any) {
  const typedRow = props.row as Row<UnknownObject> & UseRowSelectRowProps<UnknownObject>;
  const rows = props.rows as (Row<UnknownObject> & UseRowSelectRowProps<UnknownObject>)[];
  const i18n = {
    ...USE_ROW_SELECT_COLUMN_I18N_EN,
    ...(props.i18n ?? {}),
  };
  const p = { c: props.selectCheckboxComponent ?? IndeterminateCheckbox };
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
        rangeStart -= 1;
      }
      // select all others within range
      for (let i = rangeStart; i < rowIndex; i += 1) {
        rows[i].toggleRowSelected(shouldSelect);
      }
    },
    [typedRow, rows]
  );

  return (
    <div className="lt-selection">
      <p.c
        {...props.row.getToggleRowSelectedProps()}
        onClick={onClick}
        title={props.row.isSelected ? i18n.unselectRow : i18n.selectRow}
      />
    </div>
  );
}

function Summary() {
  return <div className="lt-summary " />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Header(props: any) {
  const i18n = {
    ...USE_ROW_SELECT_COLUMN_I18N_EN,
    ...(props.i18n ?? {}),
  };
  const p = { c: props.selectCheckboxComponent ?? IndeterminateCheckbox };
  return (
    <div className="lt-selection">
      <p.c
        {...props.getToggleAllRowsSelectedProps()}
        title={props.isAllRowsSelected ? i18n.unselectAll : i18n.selectAll}
      />
    </div>
  );
}

function generateColumn<D extends AnyObject = UnknownObject>(columns: ColumnInstance<D>[], meta: MetaBase<D>) {
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
    isSupport: true,
  };
  return [selectionColumn, ...columns];
}
