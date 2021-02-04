/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { CSSProperties, PropsWithChildren, useMemo } from 'react';
import { clsx } from '../utils';
import type {
  ColumnInstance,
  UseFiltersColumnProps,
  UseGroupByColumnProps,
  UseResizeColumnsColumnProps,
  UseSortByColumnProps,
} from 'react-table';
import { ActionIcons, LINEUP_LITE_TEXT_ICONS } from '../../icons';
import { LineUpLiteSortByAction } from './LineUpLiteSortByAction';
import { LineUpLiteGroupByAction } from './LineUpLiteGroupByAction';
import { LineUpLiteHideAction } from './LineUpLiteHideAction';

export interface LineUpLiteToolbarProps<D extends object = {}> extends ColumnInstance<D> {
  className?: string;
  style?: CSSProperties;
  icons?: Partial<ActionIcons>;
}

export function LineUpLiteToolbar(props: PropsWithChildren<LineUpLiteToolbarProps<any>>) {
  const column = (props as unknown) as ColumnInstance<any> &
    UseGroupByColumnProps<any> &
    UseResizeColumnsColumnProps<any> &
    UseFiltersColumnProps<any> &
    UseSortByColumnProps<any> & {
      canHide?: boolean;
    };
  const pIcons = props.icons;
  const icons = useMemo(
    () => ({
      ...LINEUP_LITE_TEXT_ICONS,
      ...(pIcons ?? {}),
    }),
    [pIcons]
  );
  return (
    <div className={clsx('lt-toolbar', props.className)} style={props.style}>
      <LineUpLiteSortByAction {...column} iconAsc={icons.sortAsc} iconDesc={icons.sortDesc} />
      <LineUpLiteGroupByAction {...column} icon={icons.groupBy} />
      {props.children}
      <LineUpLiteHideAction {...column} icon={icons.hideColumn} />
    </div>
  );
}
