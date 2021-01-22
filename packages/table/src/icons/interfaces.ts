import type React from 'react';

export interface IActionIcons {
  groupBy: React.ComponentType;
  sortAsc: React.ComponentType;
  sortDesc: React.ComponentType;
  hideColumn: React.ComponentType;
  expandGroup: React.ComponentType;
}

export interface IPaginationIcons {
  firstPage: React.ComponentType;
  previousPage: React.ComponentType;
  nextPage: React.ComponentType;
  lastPage: React.ComponentType;
}
