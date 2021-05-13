/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { forwardRef, ReactNode, Ref, RefAttributes } from 'react';
import type { ColumnInstance, HeaderGroup, UseGroupByColumnProps, UseResizeColumnsColumnProps } from 'react-table';
import type { LineUpLiteColumn, UnknownObject } from '@lineup-lite/hooks';
import { clsx } from '../utils';
import { LineUpLiteToolbar } from '../toolbar/LineUpLiteToolbar';
import type { ActionLineUpProps, AnyObject } from '../interfaces';
import { useLineUpLitePanelContext } from './contexts';

export interface LineUpLiteTHSummaryProps<D extends AnyObject = UnknownObject> extends ActionLineUpProps<D> {
  col: ColumnInstance<D>;
  children?: ReactNode;
}

const LineUpLiteTHSummaryImpl = /*! #__PURE__ */ forwardRef(function LineUpLiteTHSummary<
  D extends AnyObject = UnknownObject
>({ col, actions, icons, children }: LineUpLiteTHSummaryProps<D>, ref: Ref<HTMLElement>) {
  const column = col as unknown as HeaderGroup<D> &
    UseGroupByColumnProps<D> &
    UseResizeColumnsColumnProps<D> &
    LineUpLiteColumn<D>;
  const c = useLineUpLitePanelContext();
  const p = { c: c?.components.th ?? 'div' };
  return (
    <p.c
      ref={ref}
      className={clsx('lt-panel-th', column.isSupport && 'lt-panel-th-support', c?.classNames?.th)}
      style={c?.styles?.th}
    >
      <div className="lt-panel-th-container">
        <div
          className={clsx('lt-panel-header', c?.classNames?.header)}
          style={c?.styles?.header}
          title={column.tooltip}
        >
          {column.render('Header')}
        </div>
        <LineUpLiteToolbar<D> {...col} icons={icons} actions={actions} />
      </div>
      {column.Summary && column.render('Summary')}
      {children}
    </p.c>
  );
});

export const LineUpLiteTHSummary = LineUpLiteTHSummaryImpl as <D extends AnyObject = UnknownObject>(
  p: LineUpLiteTHSummaryProps<D> & RefAttributes<HTMLElement>
) => JSX.Element;

export default LineUpLiteTHSummary;
