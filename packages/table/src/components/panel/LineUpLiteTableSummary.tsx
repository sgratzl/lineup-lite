/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { clsx, CommonProps, mergeStyles } from '@lineup-lite/components';
import React, { forwardRef, Ref, RefAttributes } from 'react';
import type { LineUpLiteColumn, UnknownObject } from '@lineup-lite/hooks';
import type { ActionLineUpProps } from '../interfaces';
import type { LineUpLiteState, LineUpLiteTableInstance } from '../useLineUpLite';
import { useLineUpLitePanelContext } from './contexts';
import { LineUpLiteTHSummary } from './LineUpLiteTHSummary';

export interface LineUpLiteTableSummaryProps<D extends UnknownObject = UnknownObject>
  extends CommonProps,
    ActionLineUpProps<D> {
  instance: LineUpLiteTableInstance<D>;
  state?: LineUpLiteState<D>;
}

const LineUpLiteTableSummaryImpl = /*! #__PURE__ */ forwardRef(function LineUpLiteTableSummary<
  D extends UnknownObject = UnknownObject
>(props: LineUpLiteTableSummaryProps<D>, ref: Ref<HTMLElement>) {
  const c = useLineUpLitePanelContext();
  const p = { c: c?.components.tableSummary ?? 'div' };

  return (
    <p.c
      ref={ref}
      className={clsx('lt-table-summary', c?.classNames.tableSummary, props.className)}
      style={mergeStyles(c?.styles.tableSummary, props.style)}
    >
      <div>
        {props.instance.flatHeaders
          .filter((col) => !(col as LineUpLiteColumn<D>).isSupport)
          .map((col) => (
            <LineUpLiteTHSummary key={col.id} col={col} actions={props.actions} icons={props.icons} />
          ))}
      </div>
    </p.c>
  );
});

export const LineUpLiteTableSummary = LineUpLiteTableSummaryImpl as <D extends UnknownObject = UnknownObject>(
  p: LineUpLiteTableSummaryProps<D> & RefAttributes<HTMLElement>
) => JSX.Element;

export default LineUpLiteTableSummary;
