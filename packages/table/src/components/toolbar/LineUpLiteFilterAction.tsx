/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { ComponentType, MouseEvent, ReactNode } from 'react';
import type { ColumnInstance, UseFiltersColumnProps } from 'react-table';
import type { CommonProps } from '@lineup-lite/components';
import { LINEUP_LITE_I18N_EN } from '../../i18n';
import { useLineUpLiteTableContext } from '../contexts';
import { clsx } from '../utils';
import type { AnyObject, UnknownObject } from '../interfaces';

export type { UseFiltersColumnProps } from 'react-table';

export interface CustomFilterByAction<D extends AnyObject = UnknownObject> {
  (column: ColumnInstance<D> & UseFiltersColumnProps<D>):
    | {
        handler(event: MouseEvent<HTMLElement>): void;
        children?: ReactNode;
      }
    | undefined;
}

export function LineUpLiteFilterAction<D extends AnyObject = UnknownObject>(
  props: CommonProps & {
    column: ColumnInstance<D> & UseFiltersColumnProps<D>;
    children?: ReactNode;
    outerChildren?: ReactNode;
    // eslint-disable-next-line react/no-unused-prop-types
    icon: ComponentType;
    onClick?(event: MouseEvent<HTMLElement>): void;
  }
): JSX.Element {
  const { onClick, column } = props;
  const { canFilter, filterValue } = column;
  const c = useLineUpLiteTableContext();
  const i18n = c?.i18n ?? LINEUP_LITE_I18N_EN;
  return canFilter && onClick != null ? (
    <>
      <button
        className={clsx('lt-action', 'lt-action-sort', filterValue != null && 'lt-action-active', props.className)}
        style={props.style}
        type="button"
        title={i18n.filterColumn}
        onClick={onClick}
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
