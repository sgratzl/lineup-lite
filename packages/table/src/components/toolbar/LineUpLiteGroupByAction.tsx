/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { ComponentType, useCallback, MouseEvent, ReactNode } from 'react';
import type { ColumnInstance, UseGroupByColumnProps } from 'react-table';
import type { CommonProps } from '@lineup-lite/components';
import type { UseGroupingOptionsColumnProps } from '@lineup-lite/hooks';
import { LINEUP_LITE_I18N_EN } from '../../i18n';
import { useLineUpLiteTableContext } from '../contexts';
import { clsx } from '../utils';
import type { AnyObject, UnknownObject } from '../interfaces';

export type { UseGroupByColumnProps } from 'react-table';

export interface CustomGroupByAction<D extends AnyObject = UnknownObject> {
  (
    column: ColumnInstance<D> & UseGroupByColumnProps<D> & UseGroupingOptionsColumnProps,
    helper: {
      toggleGroupBy(): void;
      setGroupBy(): void;
    }
  ):
    | {
        handler(event: MouseEvent<HTMLElement>): void;
        children?: ReactNode;
      }
    | undefined;
}

export function LineUpLiteGroupByAction<D extends AnyObject = UnknownObject>(
  props: CommonProps & {
    column: UseGroupByColumnProps<D> & ColumnInstance<D>;
    children?: ReactNode;
    outerChildren?: ReactNode;
    icon: ComponentType;
    onClick?(event: MouseEvent<HTMLElement>): void;
  }
): JSX.Element {
  const c = useLineUpLiteTableContext();
  const dispatch = c?.dispatch;
  const { onClick, column } = props;
  const { toggleGroupBy, isGrouped, id, canGroupBy } = column;
  const group = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (onClick) {
        onClick(e);
        return;
      }
      if (e.shiftKey || e.ctrlKey || isGrouped || !dispatch) {
        // multi is the default
        toggleGroupBy();
      } else {
        // group by single one
        dispatch({ type: 'setGroupBy', value: [id] });
      }
    },
    [toggleGroupBy, dispatch, isGrouped, id, onClick]
  );
  const i18n = c?.i18n ?? LINEUP_LITE_I18N_EN;
  const groupBys = c?.groupByColumnCount ?? 0;
  const title = isGrouped ? i18n.groupByRemoveColumn : groupBys > 0 ? i18n.groupByAnotherColumn : i18n.groupByColumn;
  return canGroupBy ? (
    <>
      <button
        {...props.column.getGroupByToggleProps({
          className: clsx('lt-action', 'lt-action-group', isGrouped && 'lt-action-active', props.className),
          style: props.style,
        })}
        onClick={group}
        type="button"
        data-index={isGrouped && groupBys > 1 ? props.column.groupedIndex + 1 : null}
        title={title}
      >
        <props.icon />
        {props.children}
      </button>
      {props.outerChildren}
    </>
  ) : (
    <>{props.outerChildren}</>
  );
}
