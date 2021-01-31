import type { ComponentType } from 'react';

export interface ActionIcons {
  groupBy: ComponentType;
  sortAsc: ComponentType;
  sortDesc: ComponentType;
  hideColumn: ComponentType;
  expandGroup: ComponentType;
}

export interface PaginationIcons {
  firstPage: ComponentType;
  previousPage: ComponentType;
  nextPage: ComponentType;
  lastPage: ComponentType;
}
