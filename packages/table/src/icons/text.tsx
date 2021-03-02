/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import type { ActionIcons, PaginationIcons } from './interfaces';

function SortAsc(): JSX.Element {
  return <>↑</>;
}

function SortDesc(): JSX.Element {
  return <>↓</>;
}

function Delete(): JSX.Element {
  return <>×</>;
}

function ArrowDropRightLine(): JSX.Element {
  return <>▸</>;
}

function GroupBy(): JSX.Element {
  return <span style={{ transform: 'rotate(90deg)' }}>◫</span>;
}

function FirstPage(): JSX.Element {
  return <>«</>;
}

function LastPage(): JSX.Element {
  return <>»</>;
}

function NextPage(): JSX.Element {
  return <>›</>;
}

function PreviousPage(): JSX.Element {
  return <>‹</>;
}

function Filter(): JSX.Element {
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

export default LINEUP_LITE_TEXT_ICONS;
