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
import type { UseSortingOptionsColumnProps, UseGroupingOptionsColumnProps } from '@lineup-lite/hooks';
import { clsx } from '../utils';
import { LINEUP_LITE_TEXT_ICONS } from '../../icons';
import { LineUpLiteSortByAction } from './LineUpLiteSortByAction';
import { LineUpLiteGroupByAction } from './LineUpLiteGroupByAction';
import LineUpLiteHideAction from './LineUpLiteHideAction';
import type { ActionLineUpProps, UnknownObject, AnyObject } from '../interfaces';
import { LineUpLiteFilterAction } from './LineUpLiteFilterAction';
import { useLineUpLiteTableContext } from '../contexts';

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
    UseGroupingOptionsColumnProps &
    UseGroupByColumnProps<D> &
    UseResizeColumnsColumnProps<D> &
    UseFiltersColumnProps<D> &
    UseSortingOptionsColumnProps &
    UseSortByColumnProps<D> &
    UseFiltersColumnProps<D> & {
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
  const { actionSortBy, actionFilter, actionGroupBy } = props;
  const actionSortImpl = useMemo(
    () => actionSortBy?.(column, { toggleSortBy: column.toggleSortBy }),
    [actionSortBy, column]
  );

  const c = useLineUpLiteTableContext();
  const dispatch = c?.dispatch;

  const actionGroupByImpl = useMemo(
    () =>
      actionGroupBy?.(column, {
        toggleGroupBy: column.toggleGroupBy,
        setGroupBy: () => dispatch?.({ type: 'setGroupBy', value: [column.id] }),
      }),
    [actionGroupBy, column, dispatch]
  );
  const actionFilterImpl = useMemo(() => actionFilter?.(column), [actionFilter, column]);

  return (
    <div className={clsx('lt-toolbar', props.className)} style={props.style}>
      <LineUpLiteSortByAction
        column={column}
        iconAsc={icons.sortAsc}
        iconDesc={icons.sortDesc}
        onClick={actionSortImpl?.handler}
        outerChildren={actionSortImpl?.children}
      />
      <LineUpLiteGroupByAction
        column={column}
        icon={icons.groupBy}
        onClick={actionGroupByImpl?.handler}
        outerChildren={actionGroupByImpl?.children}
      />
      <LineUpLiteFilterAction
        column={column}
        icon={icons.filterColumn}
        onClick={actionFilterImpl?.handler}
        outerChildren={actionFilterImpl?.children}
      />
      {props.actions && props.actions(column, icons)}
      {props.children}
      <LineUpLiteHideAction column={column} icon={icons.hideColumn} />
    </div>
  );
}
