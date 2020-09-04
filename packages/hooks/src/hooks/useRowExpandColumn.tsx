import React from 'react';
import { ColumnInstance, Hooks } from 'react-table';
import { FullColumn } from '../interfaces';

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
  const expandColumn: FullColumn<D> = {
    id: 'expand',
    Header,
    Summary,
    Aggregated,
    Cell,
    minWidth: 20,
    width: 20,
    maxWidth: 20,
    disableFilters: true,
    disableSortBy: true,
    disableGroupBy: true,
    disableResizing: true,
  };
  return [expandColumn, ...columns];
}
