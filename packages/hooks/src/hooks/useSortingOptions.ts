/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import { actions, ActionType, CellProps, HeaderProps, Hooks, IdType, TableInstance, TableState } from 'react-table';
import type { AnyObject, UnknownObject } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SortingOptionsValue = any;
export type SortingOptions<D extends AnyObject> = Array<{ id: IdType<D>; value: SortingOptionsValue }>;

export interface UseSortingOptionsState<D extends AnyObject> {
  sortingOptions: SortingOptions<D>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseSortingOptionsInstanceProps {
  setSortingOptions: (columnId: string, value: SortingOptionsValue) => void;
}

export interface UseSortingOptionsColumnProps {
  setSortingOptions: (value: SortingOptionsValue) => void;
  sortingOptions: SortingOptionsValue;
}

export type SortingOptionsProps<D extends AnyObject = UnknownObject> = HeaderProps<D> & {
  column: UseSortingOptionsColumnProps;
};
export type SortingOptionsCellProps<D extends AnyObject = UnknownObject> = CellProps<D> & {
  column: UseSortingOptionsColumnProps;
};

export function useSortingOptions<D extends AnyObject = UnknownObject>(hooks: Hooks<D>): void {
  hooks.stateReducers.push(reducer);
  hooks.useInstance.push(useInstance);
}
useSortingOptions.pluginName = 'useSortingOptions';

// Actions
actions.setSortingOptions = 'setSortingOptions';

function reducer<D extends AnyObject = UnknownObject>(
  state: TableState<D> & Partial<UseSortingOptionsState<D>>,
  action: ActionType,
  _previousState?: TableState<D>,
  instance?: TableInstance<D>
): (TableState<D> & UseSortingOptionsState<D>) | undefined {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { allColumns } = instance!;

  if (action.type === actions.init) {
    return {
      sortingOptions: [],
      ...state,
    };
  }

  if (action.type === actions.setSortingOptions) {
    const { columnId, sortingOptions } = action as unknown as {
      columnId: string;
      sortingOptions: Record<string, unknown>;
    };

    const column = allColumns.find((d) => d.id === columnId);

    if (!column) {
      throw new Error(`React-Table: Could not find a column with id: ${columnId}`);
    }
    const previousFilter = state.sortingOptions?.find((d) => d.id === columnId);
    //
    if (sortingOptions == null) {
      return {
        ...state,
        sortingOptions: state.sortingOptions?.filter((d) => d.id !== columnId) ?? [],
      };
    }

    if (previousFilter) {
      return {
        ...state,
        sortingOptions:
          state.sortingOptions?.map((d) => {
            if (d.id === columnId) {
              return { id: columnId, value: sortingOptions };
            }
            return d;
          }) ?? [],
      };
    }

    return {
      ...state,
      sortingOptions: [...(state.sortingOptions ?? []), { id: columnId, value: sortingOptions }],
    };
  }

  return undefined;
}

function useInstance<D extends AnyObject = UnknownObject>(instance: TableInstance<D>) {
  const { dispatch, allColumns, state } = instance;
  const { sortingOptions = [] } = state as Partial<UseSortingOptionsState<D>>;

  const setSortingOptions = React.useCallback(
    (columnId: string, value: Record<string, unknown>) => {
      dispatch({ type: actions.setSortingOptions, columnId, sortingOptions: value });
    },
    [dispatch]
  );
  allColumns.forEach((column) => {
    const cc = column as Partial<UseSortingOptionsColumnProps>;
    // Provide the column a way of updating the filter value
    cc.setSortingOptions = (val: Record<string, unknown>) => setSortingOptions(column.id, val);
    // Provide the current filter value to the column for
    // convenience
    const found = sortingOptions.find((d) => d.id === column.id);
    cc.sortingOptions = found && found.value;
  });

  Object.assign(instance, {
    setSortingOptions,
  });
}
