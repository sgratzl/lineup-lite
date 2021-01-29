import React, { useCallback } from 'react';
import type { ColumnInstance, TableDispatch, UseGroupByColumnProps } from 'react-table';
import { clsx } from '../utils';

export function LineUpLiteGroupByAction(
  props: UseGroupByColumnProps<any> & ColumnInstance<any> & { icon: React.ComponentType; dispatch: TableDispatch }
) {
  const { toggleGroupBy, dispatch, isGrouped, id } = props;
  const group = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (e.shiftKey || e.ctrlKey || isGrouped) {
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
      data-index={props.isGrouped ? props.groupedIndex + 1 : null}
      title={props.isGrouped ? 'Click to group by this props' : 'Click remove grouping'}
    >
      {<props.icon />}
    </button>
  ) : null;
}
