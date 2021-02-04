/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { forwardRef, ReactElement, Ref, RefAttributes } from 'react';
import { useLineUpLiteStateContext } from '../contexts';
import { clsx } from '../utils';
import { LineUpLitePanelContextProvider } from './contexts';
import type { LineUpLitePanelProps } from './interfaces';
import { LineUpLiteDataSummary } from './LineUpLiteDataSummary';

const LineUpLitePanelImpl = /*!#__PURE__*/ forwardRef(function LineUpLitePanel<D extends object>(
  props: LineUpLitePanelProps,
  ref: Ref<HTMLElement>
) {
  const { instance, state } = useLineUpLiteStateContext<D>() ?? {};
  if (!instance) {
    return null;
  }

  const p = { c: props.components?.panel ?? 'div' };

  return (
    <p.c
      ref={ref}
      className={clsx('lt-panel', 'lt-colors', props.dark && 'lt-dark', props.className)}
      style={props.style}
    >
      <LineUpLitePanelContextProvider instance={instance} props={props}>
        <LineUpLiteDataSummary instance={instance} state={state} />
      </LineUpLitePanelContextProvider>
    </p.c>
  );
});

export const LineUpLitePanel = LineUpLitePanelImpl as (
  p: LineUpLitePanelProps & RefAttributes<HTMLElement>
) => ReactElement;
