import React, { useCallback } from 'react';
import { clsx } from './utils';
import {
  HeaderGroup,
  UseFiltersColumnProps,
  UseGroupByColumnProps,
  UseResizeColumnsColumnProps,
  UseSortByColumnProps,
} from 'react-table';
import { DEFAULT_ICONS, IIcons } from '../icons';

export interface IToolbarProps<D extends object> extends HeaderGroup<D> {
  className?: string;
  style?: React.CSSProperties;
  icons?: IIcons;
}

export default /*!#__PURE__*/ React.memo(function Toolbar(props: React.PropsWithChildren<IToolbarProps<any>>) {
  const column = (props as unknown) as HeaderGroup<any> &
    UseGroupByColumnProps<any> &
    UseResizeColumnsColumnProps<any> &
    UseFiltersColumnProps<any> &
    UseSortByColumnProps<any> & {
      canHide?: boolean;
    };

  const icons = {
    ...DEFAULT_ICONS,
    ...(props.icons ?? {}),
  };
  const hide = useCallback(() => column.toggleHidden(true), [column]);
  return (
    <div className={clsx('lt-toolbar', props.className)} style={props.style}>
      {column.canGroupBy && (
        <div
          {...column.getGroupByToggleProps({
            className: clsx('lt-action', 'lt-action-group', column.isGrouped && 'lt-action-active'),
          })}
        >
          {<icons.groupBy />}
        </div>
      )}
      {column.canSort && (
        <div
          {...column.getSortByToggleProps({
            className: clsx(
              'lt-action',
              'lt-action-sort',
              column.isSorted && 'lt-action-active',
              column.isSortedDesc && 'lt-action-desc'
            ),
          })}
        >
          {column.isSortedDesc || (!column.isSorted && (column as any).sortDescFirst) ? (
            <icons.sortDesc />
          ) : (
            <icons.sortAsc />
          )}
        </div>
      )}
      {column.canResize && column.canHide !== false && (
        <div
          {...column.getToggleHiddenProps({
            className: clsx('lt-action', 'lt-action-hide', !column.isVisible && 'lt-action-active'),
          })}
          onClick={hide}
        >
          {<icons.hideColumn />}
        </div>
      )}
    </div>
  );
});
