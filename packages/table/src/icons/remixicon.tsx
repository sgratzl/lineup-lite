/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import type { ActionIcons, PaginationIcons } from './interfaces';

// TODO check license: Apache License Version 2.0
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

function Clear() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1.2em">
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
    </svg>
  );
}

function ResetFilter() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1.2em">
      <path fill="none" d="M0 0H24V24H0z" />
      <path d="M6.929.515L21.07 14.657l-1.414 1.414-3.823-3.822L15 13.5V22H9v-8.5L4 6H3V4h4.585l-2.07-2.071L6.929.515zM9.585 6H6.404L11 12.894V20h2v-7.106l1.392-2.087L9.585 6zM21 4v2h-1l-1.915 2.872-1.442-1.443L17.596 6h-2.383l-2-2H21z" />
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

function FirstPage() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1.2em">
      <path d="M8 11.333l10.223-6.815a.5.5 0 0 1 .777.416v14.132a.5.5 0 0 1-.777.416L8 12.667V19a1 1 0 0 1-2 0V5a1 1 0 1 1 2 0v6.333zm9 4.93V7.737L10.606 12L17 16.263z" />
    </svg>
  );
}

function LastPage() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1.2em">
      <path d="M16 12.667L5.777 19.482A.5.5 0 0 1 5 19.066V4.934a.5.5 0 0 1 .777-.416L16 11.333V5a1 1 0 0 1 2 0v14a1 1 0 0 1-2 0v-6.333zm-9-4.93v8.526L13.394 12L7 7.737z" />
    </svg>
  );
}

function NextPage() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1.2em">
      <path d="M13.172 12l-4.95-4.95l1.414-1.414L16 12l-6.364 6.364l-1.414-1.414z" />
    </svg>
  );
}

function PreviousPage() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1.2em">
      <path d="M10.828 12l4.95 4.95l-1.414 1.414L8 12l6.364-6.364l1.414 1.414z" />
    </svg>
  );
}

function Filter() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1.2em">
      <path fill="none" d="M0 0H24V24H0z" />
      <path d="M21 4v2h-1l-5 7.5V22H9v-8.5L4 6H3V4h18zM6.404 6L11 12.894V20h2v-7.106L17.596 6H6.404z" />
    </svg>
  );
}

export function actionIconsRemixicon(): ActionIcons {
  return {
    groupBy: BarChartHorizontalLine,
    expandGroup: ArrowDropRightLine,
    sortAsc: SortAsc,
    sortDesc: SortDesc,
    hideColumn: DeleteBinLine,
    resetFilter: ResetFilter,
    clearSelection: Clear,
    filterColumn: Filter,
  };
}

export function paginationIconsRemixicon(): PaginationIcons & ActionIcons {
  return {
    ...actionIconsRemixicon(),
    firstPage: FirstPage,
    previousPage: PreviousPage,
    nextPage: NextPage,
    lastPage: LastPage,
  };
}
