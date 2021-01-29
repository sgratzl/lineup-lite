import React, { useCallback, useContext } from 'react';
import type { ColumnInstance, UseGroupByColumnProps } from 'react-table';
import { LineUpLiteContext } from '../contexts';
import { clsx } from '../utils';

export function LineUpLiteGroupByAction(
  props: UseGroupByColumnProps<any> & ColumnInstance<any> & { icon: React.ComponentType }
) {
  const c = useContext(LineUpLiteContext);
  const dispatch = c?.dispatch;
  const { toggleGroupBy, isGrouped, id } = props;
  const group = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
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
  return props.canGroupBy ? (
    <button
      {...props.getGroupByToggleProps({
        className: clsx('lt-action', 'lt-action-group', props.isGrouped && 'lt-action-active'),
      })}
      onClick={group}
      data-index={props.isGrouped && (c?.groupByColumnCount ?? 0) > 1 ? props.groupedIndex + 1 : null}
      title={props.isGrouped ? 'Click to group by this props' : 'Click remove grouping'}
    >
      {<props.icon />}
    </button>
  ) : null;
}
