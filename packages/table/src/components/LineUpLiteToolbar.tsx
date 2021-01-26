import React, { useCallback } from 'react';
import { clsx } from './utils';
import type {
  HeaderGroup,
  UseFiltersColumnProps,
  UseGroupByColumnProps,
  UseResizeColumnsColumnProps,
  UseSortByColumnProps,
} from 'react-table';
import { ActionIcons, actionIconsText } from '../icons';

export interface LineUpLiteToolbarProps<D extends object> extends HeaderGroup<D> {
  className?: string;
  style?: React.CSSProperties;
  icons?: Partial<ActionIcons>;
}

export default function LineUpLiteToolbar(props: React.PropsWithChildren<LineUpLiteToolbarProps<any>>) {
  const column = (props as unknown) as HeaderGroup<any> &
    UseGroupByColumnProps<any> &
    UseResizeColumnsColumnProps<any> &
    UseFiltersColumnProps<any> &
    UseSortByColumnProps<any> & {
      canHide?: boolean;
    };
  const icons = {
    ...actionIconsText(),
    ...(props.icons ?? {}),
  };
  const hide = useCallback(() => column.toggleHidden(true), [column]);
  return (
    <div className={clsx('lt-toolbar', props.className)} style={props.style}>
      {column.canSort && (
        <button
          {...column.getSortByToggleProps({
            className: clsx(
              'lt-action',
              'lt-action-sort',
              column.isSorted && 'lt-action-active',
              column.isSortedDesc && 'lt-action-desc'
            ),
          })}
          title="Click to toggle sorting"
        >
          {column.isSortedDesc || (!column.isSorted && (column as any).sortDescFirst) ? (
            <icons.sortDesc />
          ) : (
            <icons.sortAsc />
          )}
        </button>
      )}
      {column.canGroupBy && (
        <button
          {...column.getGroupByToggleProps({
            className: clsx('lt-action', 'lt-action-group', column.isGrouped && 'lt-action-active'),
          })}
          title={column.isGrouped ? 'Click to group by this column' : 'Click remove grouping'}
        >
          {<icons.groupBy />}
        </button>
      )}
      {props.children}
      {column.canResize && column.canHide !== false && (
        <button
          {...column.getToggleHiddenProps({
            className: clsx('lt-action', 'lt-action-hide', !column.isVisible && 'lt-action-active'),
          })}
          onClick={hide}
          title="Click to hide this column"
        >
          {<icons.hideColumn />}
        </button>
      )}
    </div>
  );
}