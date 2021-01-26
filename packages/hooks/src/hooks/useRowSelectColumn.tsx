import React from 'react';
import type { ColumnInstance, Hooks, Row, UseRowSelectRowProps } from 'react-table';
import type { LineUpLiteColumn } from '../interfaces';
import IndeterminateCheckbox from './IndeterminateCheckbox';

export function useRowSelectColumn<D extends object = {}>(hooks: Hooks<D>) {
  hooks.visibleColumns.push(generateColumn);
}
useRowSelectColumn.pluginName = 'useRowSelectColumn';

function Cell(props: any) {
  const typedRow = props.row as Row<any> & UseRowSelectRowProps<any>;
  const rows = props.rows as (Row<any> & UseRowSelectRowProps<any>)[];
  const onClick = React.useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
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
      <IndeterminateCheckbox {...props.row.getToggleRowSelectedProps()} onClick={onClick} />
    </div>
  );
}

function Summary({ getToggleAllRowsSelectedProps }: any) {
  return (
    <div className="le-selection le-summary">
      <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
    </div>
  );
}

function Header() {
  return <div> </div>;
}

function generateColumn<D extends object = {}>(columns: ColumnInstance<D>[]) {
  const selectionColumn: LineUpLiteColumn<D> = {
    id: 'selection',
    Header,
    Summary,
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
  return [selectionColumn, ...columns];
}
