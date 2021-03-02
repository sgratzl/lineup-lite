/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */
/* eslint-disable @typescript-eslint/ban-types */

import type {
  Column,
  ColumnInstance,
  Renderer,
  Row,
  UseFiltersColumnOptions,
  UseGroupByColumnOptions,
  UseResizeColumnsColumnOptions,
  UseSortByColumnOptions,
} from 'react-table';
import type { UseStatsColumnOptions, AnyObject, UnknownObject } from './hooks/useStats';

export type { AnyObject, UnknownObject } from './hooks/useStats';

export interface UseColumnGroupByColumnOptions<D extends AnyObject = UnknownObject> {
  /**
   * renderer used to render the group cell
   */
  Group?: Renderer<D>;
  /**
   * group by function for this column
   */
  groupBy?(rows: readonly Row<D>[], column: ColumnInstance<D>): { [key: string]: Row<D>[] };
}

/**
 * a lineup lite column description
 */
export type LineUpLiteColumn<D extends AnyObject = UnknownObject> = Column<D> &
  UseFiltersColumnOptions<D> &
  UseGroupByColumnOptions<D> &
  UseSortByColumnOptions<D> &
  UseStatsColumnOptions<D> &
  UseResizeColumnsColumnOptions<D> &
  UseColumnGroupByColumnOptions<D> & {
    canHide?: boolean;
    isSupport?: boolean;
    tooltip?: string;
  };
