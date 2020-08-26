import React from 'react';
import { ColumnInstance, Hooks } from 'react-table';
import IndeterminateCheckbox from '../components/IndeterminateCheckbox';

export function useRowSelectColumn<D extends object>(hooks: Hooks) {
  hooks.visibleColumns.push(generateColumn);
}
useRowSelectColumn.pluginName = 'useRowSelectColumn';

function generateColumn<D extends object>(columns: ColumnInstance<D>[]) {
  return [
    // Let's make a column for selection
    {
      id: 'selection',
      // The header can use the table's getToggleAllRowsSelectedProps method
      // to render a checkbox
      Header: () => null,
      Summary: ({ getToggleAllRowsSelectedProps }: any) => (
        <div className="le-selection le-summary">
          <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
        </div>
      ),
      // The cell can use the individual row's getToggleRowSelectedProps method
      // to the render a checkbox
      Cell: ({ row }: any) => (
        <div className="le-selection">
          <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
        </div>
      ),
    },
    ...columns,
  ];
}
