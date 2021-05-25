/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { CSSProperties, PropsWithChildren, useMemo } from 'react';
import type {
  ColumnInstance,
  UseFiltersColumnProps,
  UseGroupByColumnProps,
  UseResizeColumnsColumnProps,
  UseSortByColumnProps,
} from 'react-table';
import { clsx } from '../utils';
import { LINEUP_LITE_TEXT_ICONS } from '../../icons';
import { LineUpLiteSortByAction } from './LineUpLiteSortByAction';
import { LineUpLiteGroupByAction } from './LineUpLiteGroupByAction';
import LineUpLiteHideAction from './LineUpLiteHideAction';
import type { ActionLineUpProps, UnknownObject, AnyObject } from '../interfaces';

export interface LineUpLiteToolbarProps<D extends AnyObject = UnknownObject>
  extends ColumnInstance<D>,
    ActionLineUpProps<D> {
  className?: string;
  style?: CSSProperties;
}

export function LineUpLiteToolbar<D extends AnyObject = UnknownObject>(
  props: PropsWithChildren<LineUpLiteToolbarProps<D>>
): JSX.Element {
  const column = props as unknown as ColumnInstance<D> &
    UseGroupByColumnProps<D> &
    UseResizeColumnsColumnProps<D> &
    UseFiltersColumnProps<D> &
    UseSortByColumnProps<D> & {
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
      <LineUpLiteSortByAction
        column={column}
        iconAsc={icons.sortAsc}
        iconDesc={icons.sortDesc}
        onClick={props.actionSortBy}
      />
      <LineUpLiteGroupByAction column={column} icon={icons.groupBy} onClick={props.actionGroupBy} />
      {props.actions && props.actions(column, icons)}
      {props.children}
      <LineUpLiteHideAction column={column} icon={icons.hideColumn} />
    </div>
  );
}
