import React from 'react';
import { ColumnInstance, Hooks } from 'react-table';
import { FullColumn } from '../interfaces';
import IndeterminateCheckbox from './IndeterminateCheckbox';

export function useRowSelectColumn<D extends object = {}>(hooks: Hooks<D>) {
  hooks.visibleColumns.push(generateColumn);
}
useRowSelectColumn.pluginName = 'useRowSelectColumn';

function Cell({ row }: any) {
  return (
    <div className="le-selection">
      <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
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
  return null;
}

function generateColumn<D extends object = {}>(columns: ColumnInstance<D>[]) {
  const selectionColumn: FullColumn<D> = {
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
  };
  return [selectionColumn, ...columns];
}
