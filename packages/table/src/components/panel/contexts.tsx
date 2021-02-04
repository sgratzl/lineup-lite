/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { createContext, PropsWithChildren, useContext, useMemo } from 'react';
import React from 'react';
import type { TableDispatch, TableInstance } from 'react-table';
import type { CustomizeLineUpPanelProps } from './interfaces';
import { EMPTY_OBJ } from '../utils';

export interface LineUpLitePanelContextProps extends Required<CustomizeLineUpPanelProps> {
  dispatch: TableDispatch;
  dark: boolean;
}
export const LineUpLitePanelContext = createContext(undefined as LineUpLitePanelContextProps | undefined);

export function LineUpLitePanelContextProvider<D extends object = {}>(
  props: PropsWithChildren<{
    instance: TableInstance<D>;
    props: CustomizeLineUpPanelProps;
  }>
) {
  const {
    styles = EMPTY_OBJ,
    classNames = EMPTY_OBJ,
    components = EMPTY_OBJ,
    dark = false,
    i18n = EMPTY_OBJ,
  } = props.props;
  const { dispatch } = props.instance;

  const value = useMemo(
    () => ({
      styles,
      classNames,
      components,
      i18n: i18n ?? {},
      dispatch,
      dark,
    }),
    [styles, classNames, components, dispatch, dark, i18n]
  );
  return <LineUpLitePanelContext.Provider value={value}>{props.children}</LineUpLitePanelContext.Provider>;
}

export function useLineUpLitePanelContext(): LineUpLitePanelContextProps | undefined {
  return useContext(LineUpLitePanelContext);
}
