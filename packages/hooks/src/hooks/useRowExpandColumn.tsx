import React from 'react';
import { Column, ColumnInstance, Hooks, UseGroupByColumnOptions } from 'react-table';
import { UseStatsColumnOptions } from './useStats';

export function useRowExpandColumn<D extends object = {}>(hooks: Hooks<D>) {
  hooks.visibleColumns.push(generateColumn);
}
useRowExpandColumn.pluginName = 'useRowExpandColumn';

function Cell() {
  // TODO
  return <div className="le-expand"></div>;
}

function Aggregated() {
  // TODO
  return <div className="le-expand"></div>;
}

function Summary() {
  // TODO
  return <div className="le-expand le-summary"></div>;
}

function Header() {
  return null;
}

function generateColumn<D extends object = {}>(columns: ColumnInstance<D>[]) {
  const expandColumn: Column<D> & UseStatsColumnOptions<D> & UseGroupByColumnOptions<D> & { support?: boolean } = {
    id: 'expand',
    Header,
    minWidth: 20,
    width: 20,
    maxWidth: 20,
    support: true,
    Summary,
    Aggregated,
    Cell,
  };
  return [expandColumn, ...columns];
}
