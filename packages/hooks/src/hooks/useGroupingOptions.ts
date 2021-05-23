/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import {
  CellProps,
  ColumnInstance,
  ensurePluginOrder,
  HeaderProps,
  Hooks,
  IdType,
  Renderer,
  Row,
  TableInstance,
} from 'react-table';
import type { AnyObject, UnknownObject } from '../types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseGroupingOptionsOptions {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GroupingOptionsValue = any;
export type GroupingOptions<D extends AnyObject> = Array<{ id: IdType<D>; value: GroupingOptionsValue }>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseGroupingOptionsState<D extends AnyObject> {
  groupingOptions: GroupingOptions<D>;
}

export interface UseGroupingOptionsColumnOptions<D extends AnyObject = UnknownObject> {
  /**
   * renderer used to render the group cell
   */
  Group?: Renderer<D>;
  /**
   * group by function for this column
   */
  groupBy?: UseGroupingOptionGroupingFunction<D>;
}

export interface UseGroupingOptionGroupingFunction<D extends AnyObject = UnknownObject> {
  (rows: readonly Row<D>[], column: ColumnInstance<D>): Record<string, Row<D>[]>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseGroupingOptionsInstanceProps {}

export interface UseGroupingOptionsColumnProps {
  setGroupingOptions: (
    updater: ((groupingOption: GroupingOptionsValue) => GroupingOptionsValue) | GroupingOptionsValue
  ) => void;
  groupingOptions: GroupingOptionsValue;
}

export type GroupingOptionsProps<D extends AnyObject = UnknownObject> = HeaderProps<D> & {
  column: UseGroupingOptionsColumnProps;
  i18n?: Record<string, string>;
};
export type StatsCellProps<D extends AnyObject = UnknownObject> = CellProps<D> & {
  column: UseGroupingOptionsColumnProps;
  i18n?: Record<string, string>;
};

export function useGroupingOptions<D extends AnyObject = UnknownObject>(hooks: Hooks<D>): void {
  hooks.useInstance.push(useInstance);
}
useGroupingOptions.pluginName = 'useGroupingOptions';

function useInstance<D extends AnyObject = UnknownObject>(instance: TableInstance<D>) {
  ensurePluginOrder(instance.plugins, ['useGroupBy'], 'useGroupingOptions');

  // const extendedInstance = instance as unknown as TableInstance<D> & UseGroupByInstanceProps<D>;

  // instance.allColumns.forEach((col) => {
  //   // const extended = col as unknown as UseGroupingOptionsColumnProps &
  //   //   UseGroupingOptionsColumnOptions<D> &
  //   //   UseGroupByColumnProps<D>;
  //   // const flat = extendedInstance.nonGroupedFlatRows ?? instance.flatRows;
  //   // const values = flat.map((row) => row.values[col.id]);
  //   // compute current stats
  //   // extended.statsValue = extended.stats(values, extended.preFilterStatsValue);
  // });
}
