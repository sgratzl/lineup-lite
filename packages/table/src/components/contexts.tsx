/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { createContext, PropsWithChildren } from 'react';
import React from 'react';
import type { TableDispatch, TableInstance } from 'react-table';
import type { CustomizeLineUpProps } from './interfaces';
import { useLineUpLiteContext } from './hooks';
import type { LineUpLiteI18N } from '../i18n';

export interface LineUpLiteContextProps extends Required<CustomizeLineUpProps> {
  dispatch: TableDispatch;
  dark: boolean;

  i18n: LineUpLiteI18N;
  sortByColumnCount: number;
  groupByColumnCount: number;
}
export const LineUpLiteContext = createContext({} as LineUpLiteContextProps | undefined);

export function LineUpLiteContextProvider<D extends object>(
  props: PropsWithChildren<{
    instance: TableInstance<D>;
    props: CustomizeLineUpProps & { dark?: boolean; onStateChange?: (state: any) => void };
  }>
) {
  const value = useLineUpLiteContext(props.props, props.instance);
  return <LineUpLiteContext.Provider value={value}>{props.children}</LineUpLiteContext.Provider>;
}
