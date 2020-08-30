import React from 'react';
import { Column, ColumnInstance, Hooks } from 'react-table';
import IndeterminateCheckbox from './IndeterminateCheckbox';
import { UseStatsColumnOptions } from './useStats';

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
  const selectionColumn: Column<D> & UseStatsColumnOptions<D> & { support?: boolean } = {
    id: 'selection',
    Header,
    Summary,
    support: true,
    minWidth: 20,
    width: 20,
    maxWidth: 20,
    Cell,
  };
  return [selectionColumn, ...columns];
}
