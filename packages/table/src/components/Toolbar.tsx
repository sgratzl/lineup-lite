import React from 'react';
import { clsx } from './utils';
import {
  HeaderGroup,
  UseFiltersColumnProps,
  UseGroupByColumnProps,
  UseResizeColumnsColumnProps,
  UseSortByColumnProps,
} from 'react-table';

export interface IToolbarProps<D extends object> extends HeaderGroup<D> {
  className?: string;
  style?: React.CSSProperties;
}

export default /*!#__PURE__*/ React.memo(function Toolbar(props: React.PropsWithChildren<IToolbarProps<any>>) {
  const column = (props as unknown) as HeaderGroup<any> &
    UseGroupByColumnProps<any> &
    UseResizeColumnsColumnProps<any> &
    UseFiltersColumnProps<any> &
    UseSortByColumnProps<any>;
  return (
    <div className={clsx('lt-toolbar', props.className)} style={props.style}>
      {column.canGroupBy && (
        <div
          {...column.getGroupByToggleProps({
            className: clsx('lt-action', 'lt-action-group', column.isGrouped && 'lt-action-active'),
          })}
        />
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
        />
      )}
      {column.canResize && (
        <div
          {...column.getToggleHiddenProps({
            className: clsx('lt-action', 'lt-action-hide', column.isVisible && 'lt-action-active'),
          })}
        />
      )}
    </div>
  );
});
