/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type {
  Column,
  UseFiltersColumnOptions,
  UseGroupByColumnOptions,
  UseResizeColumnsColumnOptions,
  UseSortByColumnOptions,
} from 'react-table';
import type { UseStatsColumnOptions } from './hooks/useStats';
import type { AnyObject, UnknownObject } from './types';
import type { UseGroupingOptionsColumnOptions } from './hooks/useGroupingOptions';

export type { AnyObject, UnknownObject } from './types';
export type {
  UseGroupingOptionGroupingFunction as LineUpLiteGroupByFunction,
  UseGroupingOptionsColumnOptions as UseColumnGroupByColumnOptions,
} from './hooks/useGroupingOptions';

/**
 * a lineup lite column description
 */
export type LineUpLiteColumn<D extends AnyObject = UnknownObject> = Column<D> &
  UseFiltersColumnOptions<D> &
  UseGroupByColumnOptions<D> &
  UseSortByColumnOptions<D> &
  UseStatsColumnOptions<D> &
  UseResizeColumnsColumnOptions<D> &
  UseGroupingOptionsColumnOptions<D> & {
    canHide?: boolean;
    isSupport?: boolean;
    tooltip?: string;
    className?: string;
  };
