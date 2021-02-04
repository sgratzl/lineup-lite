/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { forwardRef, ReactElement, Ref, RefAttributes } from 'react';
import type { ColumnInstance, HeaderGroup, UseGroupByColumnProps, UseResizeColumnsColumnProps } from 'react-table';
import { clsx } from '../utils';
import { LineUpLiteToolbar } from '../toolbar/LineUpLiteToolbar';
import type { ActionLineUpProps } from '../interfaces';
import { useLineUpLitePanelContext } from './contexts';
import type { LineUpLiteColumn } from '@lineup-lite/hooks';

export interface LineUpLiteTHSummaryProps<D extends object = {}> extends ActionLineUpProps<D> {
  col: ColumnInstance<D>;
}

const LineUpLiteTHSummaryImpl = /*!#__PURE__*/ forwardRef(function LineUpLiteTHSummary<D extends object = {}>(
  { col, actions, icons }: LineUpLiteTHSummaryProps<D>,
  ref: Ref<HTMLElement>
) {
  const column = (col as unknown) as HeaderGroup<D> &
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
        <LineUpLiteToolbar {...col} icons={icons}>
          {actions && actions(column)}
        </LineUpLiteToolbar>
      </div>
      {column.Summary && column.render('Summary')}
    </p.c>
  );
});

export const LineUpLiteTHSummary = LineUpLiteTHSummaryImpl as <D extends object = {}>(
  p: LineUpLiteTHSummaryProps<D> & RefAttributes<HTMLElement>
) => ReactElement;
