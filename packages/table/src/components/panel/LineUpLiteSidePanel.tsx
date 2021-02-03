/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { forwardRef, Ref } from 'react';
import { useLineUpLiteStateContext } from '../contexts';
import { clsx } from '../utils';
import { LineUpLiteSidePanelContextProvider } from './contexts';
import type { LineUpLiteSidePanelProps } from './interfaces';
import { LineUpLiteDataSummary } from './LineUpLiteDataSummary';

export const LineUpLiteSidePanel = /*!#__PURE__*/ forwardRef(function LineUpLiteSidePanel(
  props: LineUpLiteSidePanelProps,
  ref: Ref<HTMLElement>
) {
  const c = useLineUpLiteStateContext();
  if (!c || !c.instance) {
    return null;
  }

  const count = c.instance.flatRows.length;

  const p = { c: props.components?.sidePanel ?? 'div' };

  return (
    <p.c ref={ref} className={clsx('lt-side-panel', props.className)} style={props.style}>
      <LineUpLiteSidePanelContextProvider instance={c.instance} props={props}>
        <LineUpLiteDataSummary count={count} />
      </LineUpLiteSidePanelContextProvider>
    </p.c>
  );
});