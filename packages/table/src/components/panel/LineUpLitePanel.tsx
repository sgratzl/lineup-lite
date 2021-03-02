/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { forwardRef, Ref, RefAttributes } from 'react';
import { useLineUpLiteStateContext } from '../contexts';
import type { AnyObject, UnknownObject } from '../interfaces';
import { clsx } from '../utils';
import { LineUpLitePanelContextProvider } from './contexts';
import type { LineUpLitePanelProps } from './interfaces';
import { LineUpLiteDataSummary } from './LineUpLiteDataSummary';
import { LineUpLiteTableSummary } from './LineUpLiteTableSummary';

const LineUpLitePanelImpl = /*! #__PURE__ */ forwardRef(function LineUpLitePanel<D extends AnyObject = UnknownObject>(
  props: LineUpLitePanelProps<D>,
  ref: Ref<HTMLElement>
) {
  const { instance, state } = useLineUpLiteStateContext<D>() ?? {};

  const p = { c: props.components?.panel ?? 'div' };

  return (
    <p.c
      ref={ref}
      className={clsx('lt-panel', 'lt-colors', props.dark && 'lt-dark', props.className)}
      style={props.style}
    >
      {instance && (
        <LineUpLitePanelContextProvider instance={instance} props={props}>
          <LineUpLiteDataSummary<D> instance={instance} state={state} icons={props.icons} />
          <LineUpLiteTableSummary<D> instance={instance} state={state} icons={props.icons} actions={props.actions} />
          {props.children}
        </LineUpLitePanelContextProvider>
      )}
    </p.c>
  );
});

export const LineUpLitePanel = LineUpLitePanelImpl as <D extends AnyObject = UnknownObject>(
  p: LineUpLitePanelProps<D> & RefAttributes<HTMLElement>
) => JSX.Element;

export default LineUpLitePanel;
