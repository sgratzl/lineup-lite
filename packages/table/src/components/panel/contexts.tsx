/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { createContext, PropsWithChildren, useContext, useMemo } from 'react';
import React from 'react';
import type { TableDispatch, TableInstance } from 'react-table';
import type { CustomizeLineUpSidePanelProps } from './interfaces';
import { EMPTY_OBJ } from '../utils';

export interface LineUpLiteSidePanelContextProps extends Required<CustomizeLineUpSidePanelProps> {
  dispatch: TableDispatch;
  dark: boolean;
}
export const LineUpLiteSidePanelContext = createContext(undefined as LineUpLiteSidePanelContextProps | undefined);

export function LineUpLiteSidePanelContextProvider<D extends object>(
  props: PropsWithChildren<{
    instance: TableInstance<D>;
    props: CustomizeLineUpSidePanelProps;
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
  return <LineUpLiteSidePanelContext.Provider value={value}>{props.children}</LineUpLiteSidePanelContext.Provider>;
}

export function useLineUpLiteSidePanelContext(): LineUpLiteSidePanelContextProps | undefined {
  return useContext(LineUpLiteSidePanelContext);
}
