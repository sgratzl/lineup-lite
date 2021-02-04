/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { forwardRef, ReactElement, Ref, RefAttributes } from 'react';
import type { TableInstance, UseFiltersInstanceProps } from 'react-table';
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
  const typedInstance = instance as TableInstance<D> & UseFiltersInstanceProps<D>;

  const count = typedInstance.flatRows.length;
  const unfiltered = typedInstance.preFilteredFlatRows?.length ?? count;

  const selected = Object.keys(state?.selectedRowIds ?? {}).length;

  const p = { c: props.components?.sidePanel ?? 'div' };

  return (
    <p.c ref={ref} className={clsx('lt-side-panel', props.className)} style={props.style}>
      <LineUpLitePanelContextProvider instance={typedInstance} props={props}>
        <LineUpLiteDataSummary count={count} selected={selected} unfiltered={unfiltered} />
      </LineUpLitePanelContextProvider>
    </p.c>
  );
});

export const LineUpLitePanel = LineUpLitePanelImpl as (
  p: LineUpLitePanelProps & RefAttributes<HTMLElement>
) => ReactElement;
