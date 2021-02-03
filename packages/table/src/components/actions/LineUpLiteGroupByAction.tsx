/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { ComponentType, useCallback, MouseEvent } from 'react';
import type { ColumnInstance, UseGroupByColumnProps } from 'react-table';
import { LINEUP_LITE_I18N_EN } from '../../i18n';
import { useLineUpLiteTableContext } from '../contexts';
import { clsx } from '../utils';

export function LineUpLiteGroupByAction(
  props: UseGroupByColumnProps<any> & ColumnInstance<any> & { icon: ComponentType }
) {
  const c = useLineUpLiteTableContext();
  const dispatch = c?.dispatch;
  const { toggleGroupBy, isGrouped, id } = props;
  const group = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (e.shiftKey || e.ctrlKey || isGrouped || !dispatch) {
        // multi is the default
        toggleGroupBy();
      } else {
        // group by single one
        dispatch({ type: 'setGroupBy', value: [id] });
      }
    },
    [toggleGroupBy, dispatch, isGrouped, id]
  );
  const i18n = c?.i18n ?? LINEUP_LITE_I18N_EN;
  const groupBys = c?.groupByColumnCount ?? 0;
  const title = props.isGrouped
    ? i18n.groupByRemoveColumn
    : groupBys > 0
    ? i18n.groupByAnotherColumn
    : i18n.groupByColumn;
  return props.canGroupBy ? (
    <button
      {...props.getGroupByToggleProps({
        className: clsx('lt-action', 'lt-action-group', props.isGrouped && 'lt-action-active'),
      })}
      onClick={group}
      data-index={props.isGrouped && groupBys > 1 ? props.groupedIndex + 1 : null}
      title={title}
    >
      {<props.icon />}
    </button>
  ) : null;
}
