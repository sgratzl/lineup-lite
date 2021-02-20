/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ComponentType } from 'react';

export interface ActionIcons {
  groupBy: ComponentType;
  sortAsc: ComponentType;
  sortDesc: ComponentType;
  expandGroup: ComponentType;
  hideColumn: ComponentType;
  resetFilter: ComponentType;
  clearSelection: ComponentType;
  filterColumn: ComponentType;
}

export interface PaginationIcons {
  firstPage: ComponentType;
  previousPage: ComponentType;
  nextPage: ComponentType;
  lastPage: ComponentType;
}
