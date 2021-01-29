import React, { useMemo } from 'react';
import { clsx } from './utils';
import type {
  HeaderGroup,
  UseFiltersColumnProps,
  UseGroupByColumnProps,
  UseResizeColumnsColumnProps,
  UseSortByColumnProps,
} from 'react-table';
import { ActionIcons, actionIconsText } from '../icons';
import { LineUpLiteSortByAction, LineUpLiteGroupByAction, LineUpLiteHideAction } from './actions';

export interface LineUpLiteToolbarProps<D extends object> extends HeaderGroup<D> {
  className?: string;
  style?: React.CSSProperties;
  icons?: Partial<ActionIcons>;
}

export function LineUpLiteToolbar(props: React.PropsWithChildren<LineUpLiteToolbarProps<any>>) {
  const column = (props as unknown) as HeaderGroup<any> &
    UseGroupByColumnProps<any> &
    UseResizeColumnsColumnProps<any> &
    UseFiltersColumnProps<any> &
    UseSortByColumnProps<any> & {
      canHide?: boolean;
    };
  const pIcons = props.icons;
  const icons = useMemo(
    () => ({
      ...actionIconsText(),
      ...(pIcons ?? {}),
    }),
    [pIcons]
  );
  return (
    <div className={clsx('lt-toolbar', props.className)} style={props.style}>
      <LineUpLiteSortByAction {...column} iconAsc={icons.sortAsc} iconDesc={icons.sortDesc} />
      <LineUpLiteGroupByAction {...column} icon={icons.groupBy} />
      {props.children}
      <LineUpLiteHideAction {...column} icon={icons.hideColumn} />
    </div>
  );
}
