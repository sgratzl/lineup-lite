import React, { useCallback } from 'react';
import type { ColumnInstance } from 'react-table';
import { clsx } from '../utils';

export function LineUpLiteHideAction(
  props: ColumnInstance<any> & { canHide?: boolean; canResize?: boolean; icon: React.ComponentType }
) {
  const { toggleHidden } = props;
  const hide = useCallback(() => toggleHidden(true), [toggleHidden]);
  return props.canResize && props.canHide !== false ? (
    <button
      {...props.getToggleHiddenProps({
        className: clsx('lt-action', 'lt-action-hide', !props.isVisible && 'lt-action-active'),
      })}
      onClick={hide}
      title="Click to hide this props"
    >
      {<props.icon />}
    </button>
  ) : null;
}
