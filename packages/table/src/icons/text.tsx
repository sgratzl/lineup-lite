import React from 'react';
import type { IActionIcons, IPaginationIcons } from './interfaces';

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
  return <>⮇</>;
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

export function actionIconsText(): IActionIcons {
  return {
    groupBy: GroupBy,
    expandGroup: ArrowDropRightLine,
    sortAsc: SortAsc,
    sortDesc: SortDesc,
    hideColumn: DeleteBinLine,
  };
}

export function paginationIconsText(): IPaginationIcons & IActionIcons {
  return {
    ...actionIconsText(),
    firstPage: FirstPage,
    previousPage: PreviousPage,
    nextPage: NextPage,
    lastPage: LastPage,
  };
}
