import React from 'react';
import { Column, ColumnInstance, Hooks } from 'react-table';
import IndeterminateCheckbox from './IndeterminateCheckbox';
import { UseStatsColumnOptions } from './useStats';

export function useRowSelectColumn<D extends object = {}>(hooks: Hooks<D>) {
  hooks.visibleColumns.push(generateColumn);
}
useRowSelectColumn.pluginName = 'useRowSelectColumn';

function generateColumn<D extends object = {}>(columns: ColumnInstance<D>[]) {
  const selectionColumn: Column<D> & UseStatsColumnOptions<D> & { support?: boolean } = {
    id: 'selection',
    // The header can use the table's getToggleAllRowsSelectedProps method
    // to render a checkbox
    Header: () => null,
    Summary: ({ getToggleAllRowsSelectedProps }: any) => (
      <div className="le-selection le-summary">
        <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
      </div>
    ),
    support: true,
    minWidth: 20,
    width: 20,
    maxWidth: 20,
    // The cell can use the individual row's getToggleRowSelectedProps method
    // to the render a checkbox
    Cell: ({ row }: any) => (
      <div className="le-selection">
        <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
      </div>
    ),
  };
  return [selectionColumn, ...columns];
}
