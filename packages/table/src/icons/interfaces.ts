import type React from 'react';

export interface ActionIcons {
  groupBy: React.ComponentType;
  sortAsc: React.ComponentType;
  sortDesc: React.ComponentType;
  hideColumn: React.ComponentType;
  expandGroup: React.ComponentType;
}

export interface PaginationIcons {
  firstPage: React.ComponentType;
  previousPage: React.ComponentType;
  nextPage: React.ComponentType;
  lastPage: React.ComponentType;
}
