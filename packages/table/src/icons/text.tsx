/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import type { ActionIcons, PaginationIcons } from './interfaces';

function SortAsc() {
  return <>↑</>;
}

function SortDesc() {
  return <>↓</>;
}

function Delete() {
  return <>×</>;
}

function ArrowDropRightLine() {
  return <>▸</>;
}

function GroupBy() {
  return <span style={{ transform: 'rotate(90deg)' }}>◫</span>;
}

function FirstPage() {
  return <>«</>;
}

function LastPage() {
  return <>»</>;
}

function NextPage() {
  return <>›</>;
}

function PreviousPage() {
  return <>‹</>;
}

function Filter() {
  return <>#</>;
}

export const LINEUP_LITE_TEXT_ICONS: PaginationIcons & ActionIcons = {
  groupBy: GroupBy,
  expandGroup: ArrowDropRightLine,
  sortAsc: SortAsc,
  sortDesc: SortDesc,
  hideColumn: Delete,
  resetFilter: Delete,
  clearSelection: Delete,
  firstPage: FirstPage,
  previousPage: PreviousPage,
  nextPage: NextPage,
  lastPage: LastPage,
  filterColumn: Filter,
};
