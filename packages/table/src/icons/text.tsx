import React from 'react';
import type { ActionIcons, PaginationIcons } from './interfaces';

function SortAsc() {
  return <>↑</>;
}

function SortDesc() {
  return <>↓</>;
}

function DeleteBinLine() {
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

export const LINEUP_LITE_TEXT_ICONS: PaginationIcons & ActionIcons = {
  groupBy: GroupBy,
  expandGroup: ArrowDropRightLine,
  sortAsc: SortAsc,
  sortDesc: SortDesc,
  hideColumn: DeleteBinLine,
  firstPage: FirstPage,
  previousPage: PreviousPage,
  nextPage: NextPage,
  lastPage: LastPage,
};
