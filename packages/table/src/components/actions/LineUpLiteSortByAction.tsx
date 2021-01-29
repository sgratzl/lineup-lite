import React, { useCallback, useContext } from 'react';
import type { UseSortByColumnProps } from 'react-table';
import { LineUpLiteContext } from '../contexts';
import { clsx } from '../utils';

export function LineUpLiteSortByAction(
  props: UseSortByColumnProps<any> & { iconAsc: React.ComponentType; iconDesc: React.ComponentType }
) {
  const { toggleSortBy, isSorted } = props;
  const sort = useCallback(
    (e: React.MouseEvent<HTMLElement>) => toggleSortBy(undefined, e.shiftKey || e.ctrlKey || isSorted),
    [toggleSortBy, isSorted]
  );
  const c = useContext(LineUpLiteContext);
  return props.canSort ? (
    <button
      {...props.getSortByToggleProps({
        className: clsx(
          'lt-action',
          'lt-action-sort',
          props.isSorted && 'lt-action-active',
          props.isSortedDesc && 'lt-action-desc'
        ),
      })}
      onClick={sort}
      data-index={props.isSorted && (c?.sortByColumnCount ?? 0) > 1 ? props.sortedIndex + 1 : null}
      title="Click to toggle sorting"
    >
      {props.isSortedDesc || (!props.isSorted && (props as any).sortDescFirst) ? <props.iconDesc /> : <props.iconAsc />}
    </button>
  ) : null;
}
