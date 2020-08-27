import React from 'react';
import { Column, ColumnInstance, Hooks } from 'react-table';
import { UseStatsColumnOptions } from './useStats';

export function useRowExpandColumn<D extends object = {}>(hooks: Hooks<D>) {
  hooks.visibleColumns.push(generateColumn);
}
useRowExpandColumn.pluginName = 'useRowExpandColumn';

function generateColumn<D extends object = {}>(columns: ColumnInstance<D>[]) {
  const expandColumn: Column<D> & UseStatsColumnOptions<D> & { support?: boolean } = {
    id: 'expand',
    // The header can use the table's getToggleAllRowsSelectedProps method
    // to render a checkbox
    Header: () => null,
    minWidth: 20,
    width: 20,
    maxWidth: 20,
    support: true,
    Summary: () => <div className="le-expand le-summary"></div>,
    // The cell can use the individual row's getToggleRowSelectedProps method
    // to the render a checkbox
    Cell: () => <div className="le-expand"></div>,
  };
  return [expandColumn, ...columns];
}
