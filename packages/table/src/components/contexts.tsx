/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import React from 'react';
import type { TableDispatch } from 'react-table';
import type { CustomizeLineUpProps } from './interfaces';
import { EMPTY_OBJ } from './utils';
import type { LineUpLiteState, LineUpLiteTableInstance } from './useLineUpLite';

export interface LineUpLiteTableContextProps extends Required<CustomizeLineUpProps> {
  dispatch: TableDispatch;
  dark: boolean;

  sortByColumnCount: number;
  groupByColumnCount: number;
}
export const LineUpLiteTableContext = createContext(undefined as LineUpLiteTableContextProps | undefined);

export function LineUpLiteTableContextProvider<D extends object>(
  props: PropsWithChildren<{
    instance: LineUpLiteTableInstance<D>;
    props: CustomizeLineUpProps;
  }>
) {
  const {
    styles = EMPTY_OBJ,
    classNames = EMPTY_OBJ,
    components = EMPTY_OBJ,
    dark = false,
    i18n = EMPTY_OBJ,
  } = props.props;
  const { dispatch, state } = props.instance;

  const sortByColumnCount = (state as any).sortBy?.length ?? 0;
  const groupByColumnCount = (state as any).groupBy?.length ?? 0;

  const value = useMemo(
    () => ({
      styles,
      classNames,
      components,
      i18n: i18n ?? {},
      dispatch,
      dark,
      sortByColumnCount,
      groupByColumnCount,
    }),
    [styles, classNames, components, dispatch, dark, sortByColumnCount, groupByColumnCount, i18n]
  );
  return <LineUpLiteTableContext.Provider value={value}>{props.children}</LineUpLiteTableContext.Provider>;
}

export function useLineUpLiteTableContext(): LineUpLiteTableContextProps | undefined {
  return useContext(LineUpLiteTableContext);
}

export interface LineUpLiteStateContextProps<D extends object> {
  state?: LineUpLiteState;
  instance?: LineUpLiteTableInstance<D>;
}

export interface LineUpLiteStateContextSetter<D extends object> {
  setState(state: LineUpLiteState): void;
  setInstance(instance: LineUpLiteTableInstance<D>): void;
}
export const LineUpLiteStateContext = createContext(undefined as LineUpLiteStateContextProps<any> | undefined);
export const LineUpLiteStateSetterContext = createContext(undefined as LineUpLiteStateContextSetter<any> | undefined);

export function useStateListener<D extends object>(
  props: {
    onStateChange?: (state: LineUpLiteState) => void;
  },
  instance: LineUpLiteTableInstance<D>
): void {
  const { onStateChange } = props;
  const { state } = instance;

  useEffect(() => {
    if (onStateChange) {
      onStateChange((state as unknown) as LineUpLiteState<D>);
    }
  }, [onStateChange, state]);

  // update state context
  const { setState, setInstance } = useContext(LineUpLiteStateSetterContext) ?? {};
  useEffect(() => {
    if (setState) {
      setState((state as unknown) as LineUpLiteState<D>);
    }
  }, [setState, state]);
  useEffect(() => {
    if (setInstance) {
      setInstance(instance);
    }
  }, [setInstance, instance]);
}

export function LineUpLiteStateContextProvider<D extends object = {}>(props: PropsWithChildren<{}>) {
  const [state, setState] = useState(undefined as undefined | LineUpLiteState);
  const [instance, setInstance] = useState(undefined as undefined | LineUpLiteTableInstance<D>);
  // have a context which are just the values which will change
  const read = useMemo(() => {
    return { state, instance };
  }, [state, instance]);
  // have a context that won't change and are just setters
  const set = useMemo(() => {
    return { setState, setInstance };
  }, [setState, setInstance]);
  return (
    <LineUpLiteStateContext.Provider value={read}>
      <LineUpLiteStateSetterContext.Provider value={set}>{props.children}</LineUpLiteStateSetterContext.Provider>
    </LineUpLiteStateContext.Provider>
  );
}

export function useLineUpLiteStateContext<D extends object = {}>(): LineUpLiteStateContextProps<D> | undefined {
  return useContext(LineUpLiteStateContext);
}
