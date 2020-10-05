import React from 'react';

// from https://remixicon.com/

function SortAsc() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1.2em">
      <path fill="none" d="M0 0H24V24H0z" />
      <path d="M19 3l4 5h-3v12h-2V8h-3l4-5zm-5 15v2H3v-2h11zm0-7v2H3v-2h11zm-2-7v2H3V4h9z" />
    </svg>
  );
}

function SortDesc() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1.2em">
      <path fill="none" d="M0 0H24V24H0z" />
      <path d="M20 4v12h3l-4 5-4-5h3V4h2zm-8 14v2H3v-2h9zm2-7v2H3v-2h11zm0-7v2H3V4h11z" />
    </svg>
  );
}

function DeleteBinLine() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1.2em">
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z" />
    </svg>
  );
}

function ArrowDropRightLine() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1.2em">
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M12.172 12L9.343 9.172l1.414-1.415L15 12l-4.243 4.243-1.414-1.415z" />
    </svg>
  );
}

function BarChartHorizontalLine() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1.2em">
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M12 3v2H3V3h9zm4 16v2H3v-2h13zm6-8v2H3v-2h19z" />
    </svg>
  );
}

export interface IIcons {
  groupBy: React.ComponentType;
  sortAsc: React.ComponentType;
  sortDesc: React.ComponentType;
  hideColumn: React.ComponentType;
  expandGroup: React.ComponentType;
}

export const DEFAULT_ICONS: IIcons = {
  groupBy: BarChartHorizontalLine,
  expandGroup: ArrowDropRightLine,
  sortAsc: SortAsc,
  sortDesc: SortDesc,
  hideColumn: DeleteBinLine,
};
