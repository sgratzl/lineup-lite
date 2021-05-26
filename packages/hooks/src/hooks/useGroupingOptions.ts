/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import {
  actions,
  ActionType,
  CellProps,
  ColumnInstance,
  HeaderProps,
  Hooks,
  IdType,
  Renderer,
  Row,
  TableInstance,
  TableState,
} from 'react-table';
import type { AnyObject, UnknownObject } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GroupingOptionsValue = any;
export type GroupingOptions<D extends AnyObject> = Array<{ id: IdType<D>; value: GroupingOptionsValue }>;

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
  (rows: readonly Row<D>[], column: ColumnInstance<D>, options?: AnyObject): Record<string, Row<D>[]>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseGroupingOptionsInstanceProps {
  setGroupingOptions: (columnId: string, value: GroupingOptionsValue) => void;
}

export interface UseGroupingOptionsColumnProps {
  setGroupingOptions: (value: GroupingOptionsValue) => void;
  groupingOptions: GroupingOptionsValue;
}

export type GroupingOptionsProps<D extends AnyObject = UnknownObject> = HeaderProps<D> & {
  column: UseGroupingOptionsColumnProps;
};
export type GroupingOptionsCellProps<D extends AnyObject = UnknownObject> = CellProps<D> & {
  column: UseGroupingOptionsColumnProps;
};

export function useGroupingOptions<D extends AnyObject = UnknownObject>(hooks: Hooks<D>): void {
  hooks.stateReducers.push(reducer);
  hooks.useInstance.push(useInstance);
}
useGroupingOptions.pluginName = 'useGroupingOptions';

// Actions
actions.setGroupingOptions = 'setGroupingOptions';

function reducer<D extends AnyObject = UnknownObject>(
  state: TableState<D> & Partial<UseGroupingOptionsState<D>>,
  action: ActionType,
  _previousState?: TableState<D>,
  instance?: TableInstance<D>
): (TableState<D> & UseGroupingOptionsState<D>) | undefined {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { allColumns } = instance!;

  if (action.type === actions.init) {
    return {
      groupingOptions: [],
      ...state,
    };
  }

  if (action.type === actions.setGroupingOptions) {
    const { columnId, groupingOptions } = action as unknown as {
      columnId: string;
      groupingOptions: Record<string, unknown>;
    };

    const column = allColumns.find((d) => d.id === columnId);

    if (!column) {
      throw new Error(`React-Table: Could not find a column with id: ${columnId}`);
    }
    const previousFilter = state.groupingOptions?.find((d) => d.id === columnId);
    //
    if (groupingOptions == null) {
      return {
        ...state,
        groupingOptions: state.groupingOptions?.filter((d) => d.id !== columnId) ?? [],
      };
    }

    if (previousFilter) {
      return {
        ...state,
        groupingOptions:
          state.groupingOptions?.map((d) => {
            if (d.id === columnId) {
              return { id: columnId, value: groupingOptions };
            }
            return d;
          }) ?? [],
      };
    }

    return {
      ...state,
      groupingOptions: [...(state.groupingOptions ?? []), { id: columnId, value: groupingOptions }],
    };
  }

  return undefined;
}

function useInstance<D extends AnyObject = UnknownObject>(instance: TableInstance<D>) {
  const { dispatch, allColumns, state } = instance;
  const { groupingOptions = [] } = state as Partial<UseGroupingOptionsState<D>>;

  const setGroupingOptions = React.useCallback(
    (columnId: string, value: Record<string, unknown>) => {
      dispatch({ type: actions.setGroupingOptions, columnId, groupingOptions: value });
    },
    [dispatch]
  );
  allColumns.forEach((column) => {
    const cc = column as Partial<UseGroupingOptionsColumnProps>;
    // Provide the column a way of updating the filter value
    cc.setGroupingOptions = (val: Record<string, unknown>) => setGroupingOptions(column.id, val);
    // Provide the current filter value to the column for
    // convenience
    const found = groupingOptions.find((d) => d.id === column.id);
    cc.groupingOptions = found && found.value;
  });

  Object.assign(instance, {
    setGroupingOptions,
  });
}
