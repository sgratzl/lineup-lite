/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { forwardRef, ReactElement, ReactNode, Ref, RefAttributes } from 'react';
import type { HeaderGroup, UseGroupByColumnProps, UseResizeColumnsColumnProps } from 'react-table';
import type { LineUpLiteColumn, UnknownObject, AnyObject } from '@lineup-lite/hooks';
import { clsx, mergeStyles } from './utils';
import { LineUpLiteToolbar } from './toolbar/LineUpLiteToolbar';
import type { ActionLineUpProps } from './interfaces';
import { useLineUpLiteTableContext } from './contexts';

export interface LineUpLiteTHProps<D extends AnyObject = UnknownObject> extends ActionLineUpProps<D> {
  col: HeaderGroup<D>;
  children?: ReactNode;
}

const LineUpLiteTHImpl = /*! #__PURE__ */ forwardRef(function LineUpLiteTH<D extends AnyObject = UnknownObject>(
  { col, actions, icons, children, actionFilter, actionGroupBy, actionSortBy }: LineUpLiteTHProps<D>,
  ref: Ref<HTMLElement>
) {
  const column = col as unknown as HeaderGroup<D> &
    UseGroupByColumnProps<D> &
    UseResizeColumnsColumnProps<D> &
    LineUpLiteColumn<D>;
  const c = useLineUpLiteTableContext();
  const p = { c: c?.components.th ?? 'div' };
  return (
    <p.c
      ref={ref}
      {...column.getHeaderProps({
        className: clsx(
          'lt-th',
          column.isSupport && 'lt-th-support',
          c?.classNames?.th,
          column.className,
          clsx(column.isResizing && 'lt-column-resizing')
        ),
        style: mergeStyles({ display: '' }, c?.styles?.th),
      })}
      data-id={column.id}
    >
      {column.canResize && typeof column.getResizerProps === 'function' && (
        <div
          {...column.getResizerProps({
            className: 'lt-column-resize-handle',
          })}
        />
      )}
      <div className={clsx('lt-header', c?.classNames?.header)} style={c?.styles?.header} title={column.tooltip}>
        {column.render('Header')}
      </div>
      <LineUpLiteToolbar
        {...col}
        icons={icons}
        actions={actions}
        actionFilter={actionFilter}
        actionGroupBy={actionGroupBy}
        actionSortBy={actionSortBy}
      />
      {column.Summary && column.render('Summary')}
      {children}
    </p.c>
  );
});

export const LineUpLiteTH = LineUpLiteTHImpl as <D extends AnyObject = UnknownObject>(
  p: LineUpLiteTHProps<D> & RefAttributes<HTMLElement>
) => ReactElement;
